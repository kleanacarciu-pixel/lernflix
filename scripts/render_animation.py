#!/usr/bin/env python3
"""
render_animation.py — Phase 2b: echte Mathe-Animation mit Manim.

Ablauf (laeuft in GitHub Actions, NICHT auf Vercel):
  1. Naechstes geprueftes Paket (qa_ok=true, animation_status none/null) aus
     content_log holen  -> auf 'rendering' setzen.
  2. Claude (claude-sonnet-4-6) schreibt aus dem Paket ein vollstaendiges
     manim-voiceover-Skript: 9:16, deutsche Stimme, Schritt-fuer-Schritt-Mathe,
     Voice synchron zur Animation, Marken-Ton "Anna".
  3. Rendern mit Manim. Bei Crash: Fehler + Code zurueck an Claude -> Fix -> retry.
  4. Fertiges MP4 in Supabase Storage hochladen, animation_url + 'ready' speichern.
     Bei endgueltigem Fehler: 'failed'.

Aufruf: python scripts/render_animation.py   (Env-Variablen siehe unten)
Optional: ROW_ID=<id> rendert genau diese content_log-Zeile neu.
"""

import glob
import json
import os
import re
import subprocess
import sys
import textwrap

import requests

# ---------------------------------------------------------------- Konfiguration
# .strip(): Secrets werden beim Einfuegen (GitHub-UI) gerne mit einem
# Zeilenumbruch/Leerzeichen kopiert — das wuerde HTTP-Header zerstoeren.
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"].strip()
SUPABASE_URL = os.environ["SUPABASE_URL"].strip().rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"].strip()
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
ROW_ID = os.environ.get("ROW_ID", "").strip()

# Die (alte) elevenlabs-Lib liest den Key aus ELEVEN_API_KEY. Sonst fragt
# manim-voiceover interaktiv nach -> EOFError in CI -> Fallback auf Roboter-gTTS.
# Deshalb beide Varianten setzen, damit echt ElevenLabs benutzt wird.
if ELEVENLABS_API_KEY:
    os.environ["ELEVEN_API_KEY"] = ELEVENLABS_API_KEY
    os.environ["ELEVENLABS_API_KEY"] = ELEVENLABS_API_KEY

MODEL = "claude-sonnet-4-6"
BUCKET = "shorts"            # oeffentlicher Supabase-Storage-Bucket
MAX_REPAIRS = 4             # Versuche, von Claude generierten Code zu reparieren

# ElevenLabs "Emilia" — deutsche weibliche Stimme (via manim-voiceover).
ELEVEN_VOICE_ID = "Dt2jDzhoZC0pZw5bmy2S"


# ----------------------------------------------------------------- Supabase REST
def sb_headers(extra=None):
    h = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    if extra:
        h.update(extra)
    return h


def get_row():
    if ROW_ID:
        q = f"?id=eq.{ROW_ID}&select=id,paket"
    else:
        q = (
            "?qa_ok=eq.true"
            "&or=(animation_status.eq.none,animation_status.is.null)"
            "&order=id.asc&limit=1&select=id,paket"
        )
    r = requests.get(f"{SUPABASE_URL}/rest/v1/content_log{q}", headers=sb_headers(), timeout=30)
    r.raise_for_status()
    rows = r.json()
    return rows[0] if rows else None


def update_row(row_id, fields):
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/content_log?id=eq.{row_id}",
        headers=sb_headers({"Prefer": "return=minimal"}),
        data=json.dumps(fields),
        timeout=30,
    )
    r.raise_for_status()


def upload_to_storage(local_path, dest_name):
    with open(local_path, "rb") as f:
        data = f.read()
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{dest_name}"
    r = requests.post(
        url,
        headers=sb_headers({"Content-Type": "video/mp4", "x-upsert": "true"}),
        data=data,
        timeout=180,
    )
    if not r.ok:
        raise RuntimeError(f"Storage-Upload {r.status_code}: {r.text[:300]}")
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{dest_name}"


# --------------------------------------------------------------------- Anthropic
def call_claude(system, user_text, max_tokens=4500):
    r = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        data=json.dumps(
            {
                "model": MODEL,
                "max_tokens": max_tokens,
                "system": system,
                "messages": [{"role": "user", "content": user_text}],
            }
        ),
        timeout=180,
    )
    r.raise_for_status()
    return "".join(b.get("text", "") for b in r.json().get("content", []))


def extract_code(text):
    m = re.search(r"```(?:python)?\s*(.*?)```", text, re.S)
    code = (m.group(1) if m else text).strip()
    return code


# ----------------------------------------------------------------- Manim-Prompt
def speech_service_snippet():
    """Import + Setup-Zeile fuer den TTS-Dienst (ElevenLabs, sonst gTTS)."""
    if ELEVENLABS_API_KEY:
        imp = "from manim_voiceover.services.elevenlabs import ElevenLabsService"
        setup = (
            f'self.set_speech_service(ElevenLabsService(voice_id="{ELEVEN_VOICE_ID}", '
            'voice_settings={"stability": 0.4, "similarity_boost": 0.8}))'
        )
    else:
        imp = "from manim_voiceover.services.gtts import GTTSService"
        setup = 'self.set_speech_service(GTTSService(lang="de"))'
    return imp, setup


SYSTEM_PROMPT = """Du bist Profi fuer virale Mathe-Shorts UND Experte fuer Manim Community Edition
(v0.18+) mit manim-voiceover. Du schreibst EIN lauffaehiges Python-Skript fuer ein deutsches
9:16-Short (ca. 25-35 Sekunden) der Marke "Anna".

STIL — das Wichtigste (das letzte Video war zu kompliziert, langweilig und voll. Mach das GEGENTEIL):
- SIMPEL: EINE einzige Kernidee. Erklaere sie so, dass es sofort "klick" macht. Keine
  Herleitungen, keine Fachsprache, kein ueberladenes Bild.
- GROSS & LUFTIG: meist nur EIN grosses Element gleichzeitig auf dem Schirm, viel Leerraum,
  zentriert. Schrift riesig (font_size 60-110). Nie mehr als 2-3 Dinge gleichzeitig sichtbar.
- SCHNELL & ENERGISCH: kurze, knackige Saetze. Tempo wie ein guter TikTok — keine langen Pausen,
  kein monotones Vorlesen.
- WITZIG & MENSCHLICH: Anna ist locker, schlagfertig, ein kleiner Spruch oder Aha-Vergleich gehoert
  rein (z.B. ein Alltags-Bild). Kein Lehrer-Ton, kein Kinderkram.
- HOOK in den ersten ~2 Sekunden, der neugierig macht ("Fast jeder macht das falsch ..." o.ae.).
- Ende: ein befriedigender Aha-Moment + kurzer CTA "lernflix.lernemitanna.de".

TECHNIK (hart einhalten, sonst crasht der Render):
- Nur Manim-Bordmittel. KEINE externen Dateien/Bilder/Fonts/Internet (ausser TTS).
- Genau eine Szene: `class Short(VoiceoverScene):` mit `def construct(self):`.
- ERSTE Zeile in construct(): die vorgegebene set_speech_service(...)-Zeile EXAKT uebernehmen.
- `self.camera.background_color = "#EAF3FF"`; Text dunkel "#15233A"; Akzent "#C77B96" zum Hervorheben.
- VOICE-VISUAL-SYNC: Jede Aussage in einem `with self.voiceover(text="...") as tracker:`-Block, und die
  Animation darin zeigt GENAU das Gesagte. `run_time=tracker.duration` fuer die Hauptanimation.
- NUR 3 bis 5 voiceover-Bloecke. Kurze Saetze.
- Mathe exakt korrekt. Formeln mit MathTex(...), deutscher Text mit Text(...). Echte Umlaute (ae/oe/ue/ss
  NICHT verwenden).
- Hochformat schmal+hoch: ALLES mit Rand im Bild halten (nutze .scale_to_fit_width(6.5) o.ae. fuer breite
  Objekte), nichts abschneiden. Vor jedem neuen Schritt Altes mit FadeOut entfernen, damit es nie voll wird.
- Gib NUR den vollstaendigen Python-Code aus, in EINEM ```python ... ``` Block. Keine Erklaerung."""


def build_user_prompt(paket, imp, setup):
    onscreen = "\n".join(f"  - {s}" for s in paket.get("onScreen", []))
    return textwrap.dedent(
        f"""\
        Erstelle das Manim-Skript fuer dieses gepruefte Paket.

        THEMA: {paket.get('thema','')}
        HOOK: {paket.get('hook','')}
        SKRIPT (inhaltliche Grundlage, darfst du fuer die Voiceover-Texte umformulieren/kuerzen):
        {paket.get('skript','')}
        ON-SCREEN-SCHRITTE (als visuelle Schritte umsetzen):
        {onscreen}
        CTA: {paket.get('cta','')}

        Verwende fuer den Sprachdienst GENAU diese imports/Zeile:
        IMPORT: {imp}
        SETUP-ZEILE (erste Zeile in construct): {setup}

        Standard-Imports oben: `from manim import *` und `from manim_voiceover import VoiceoverScene`.
        """
    )


def generate_code(paket):
    imp, setup = speech_service_snippet()
    system = SYSTEM_PROMPT
    user = build_user_prompt(paket, imp, setup)
    raw = call_claude(system, user)
    return extract_code(raw)


def repair_code(code, error_log):
    system = SYSTEM_PROMPT
    user = textwrap.dedent(
        f"""\
        Das folgende Manim-Skript ist beim Rendern fehlgeschlagen. Behebe den Fehler und gib den
        KORRIGIERTEN, vollstaendigen Code zurueck (nur ```python ... ```). Behalte Stil, Marke und den
        Voice-Visual-Sync. Achte auf gueltige Manim-v0.18-API und dass nichts aus dem Bild laeuft.
        WICHTIG: Aendere NIEMALS die set_speech_service(...)-Zeile (kein Wechsel zu GTTS oder einer
        anderen Stimme) — die Stimme MUSS ElevenLabs bleiben.

        FEHLER (gekuerzt):
        {error_log[-3000:]}

        BISHERIGER CODE:
        ```python
        {code}
        ```
        """
    )
    raw = call_claude(system, user)
    return extract_code(raw)


# ------------------------------------------------------------------- Manim-Lauf
def render_scene(code):
    """Schreibt scene.py, rendert. Gibt (mp4_path, None) oder (None, error_log)."""
    with open("scene.py", "w", encoding="utf-8") as f:
        f.write(code)

    # Aufraeumen, damit wir das frische MP4 sicher finden.
    subprocess.run(["rm", "-rf", "media"], check=False)

    cmd = [
        "manim", "render",
        "--resolution", "1080,1920",
        "--fps", "30",
        "-q", "h",
        "scene.py", "Short",
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=1500)
    if proc.returncode != 0:
        return None, (proc.stdout + "\n" + proc.stderr)

    matches = glob.glob("media/videos/**/Short.mp4", recursive=True)
    if not matches:
        return None, "Render lief durch, aber keine Short.mp4 gefunden.\n" + proc.stdout[-1500:]
    # neueste Datei
    matches.sort(key=os.path.getmtime, reverse=True)
    return matches[0], None


# -------------------------------------------------------------------------- Main
def main():
    row = get_row()
    if not row:
        print("Nichts zu rendern (kein qa_ok=true Paket mit animation_status none).")
        return 0

    row_id = row["id"]
    paket = row["paket"]
    if isinstance(paket, str):
        paket = json.loads(paket)

    print(f"== Rendere content_log #{row_id}: {paket.get('thema','?')}")
    update_row(row_id, {"animation_status": "rendering"})

    try:
        code = generate_code(paket)
        last_error = None
        mp4 = None

        for versuch in range(1, MAX_REPAIRS + 1):
            print(f"-- Render-Versuch {versuch}/{MAX_REPAIRS}")
            try:
                mp4, err = render_scene(code)
            except subprocess.TimeoutExpired:
                mp4, err = None, "Manim-Timeout (zu lange/zu komplex)."
            if mp4:
                print(f"   OK: {mp4}")
                break
            last_error = err
            print(f"   Fehlgeschlagen. Lasse Claude reparieren ...\n{(err or '')[-800:]}")
            if versuch < MAX_REPAIRS:
                code = repair_code(code, err or "")

        if not mp4:
            raise RuntimeError(f"Render nach {MAX_REPAIRS} Versuchen fehlgeschlagen:\n{(last_error or '')[-800:]}")

        # Schutz: wenn ElevenLabs gewollt war, aber auf Roboter-gTTS ausgewichen
        # wurde, das Ergebnis NICHT hochladen (lieber failed als Roboter-Stimme).
        if ELEVENLABS_API_KEY and "GTTSService" in code:
            raise RuntimeError("ElevenLabs liess sich nicht laden (Fallback auf gTTS) — Video verworfen.")

        dest = f"short-{row_id}.mp4"
        url = upload_to_storage(mp4, dest)
        update_row(row_id, {"animation_url": url, "animation_status": "ready", "manim_code": code})
        print(f"== Fertig: {url}")
        return 0

    except Exception as e:  # noqa: BLE001
        print(f"!! Fehler: {e}", file=sys.stderr)
        update_row(row_id, {"animation_status": "failed"})
        return 1


if __name__ == "__main__":
    sys.exit(main())
