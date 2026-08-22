import { NextResponse } from "next/server";
import type { Fach, SchulartId } from "@/lib/quiz/catalog";
import { schulartById, themaOhneEmoji } from "@/lib/quiz/catalog";
import { getAufgaben } from "@/lib/quiz/store";
import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

// Kuratierte, interaktive Aufgaben aus dem Repo — KEINE Live-KI, kein Supabase.
// POST läuft immer zur Laufzeit (Auswahl im Body), daher dynamisch.
export const dynamic = "force-dynamic";

const FAECHER: Fach[] = ["mathe", "physik"];

// Fisher-Yates.
function mischen<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Bei Multiple-Choice-Aufgaben die Antwort-Reihenfolge mischen, damit die
// richtige Antwort nicht immer an derselben Stelle steht. Andere Typen bleiben
// in der (didaktisch aufsteigenden) Reihenfolge.
function aufbereiten(a: Aufgabe): Aufgabe {
  if (a.typ !== "mc") return a;
  const reihenfolge = mischen([0, 1, 2, 3].slice(0, a.antworten.length));
  const antworten = reihenfolge.map((i) => a.antworten[i]);
  const richtig = reihenfolge.indexOf(a.richtig);
  return { ...a, antworten, richtig };
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: Record<string, unknown> = {};
    try {
      const raw = await request.json();
      if (raw && typeof raw === "object") body = raw as Record<string, unknown>;
    } catch {
      // Body bleibt {}
    }

    const fach: Fach = FAECHER.includes(body.fach as Fach) ? (body.fach as Fach) : "mathe";
    const schulart = schulartById(String(body.schulart ?? ""));
    const klasse = parseInt(String(body.klasse ?? ""), 10);
    const thema = themaOhneEmoji(String(body.thema ?? ""));

    if (!schulart) {
      return NextResponse.json({ aufgaben: [], status: "fehler", grund: "Schulart fehlt" }, { status: 400 });
    }
    if (!Number.isFinite(klasse) || !schulart.klassen.includes(klasse)) {
      return NextResponse.json({ aufgaben: [], status: "fehler", grund: "Klasse ungültig" }, { status: 400 });
    }
    if (!thema) {
      return NextResponse.json({ aufgaben: [], status: "fehler", grund: "Thema fehlt" }, { status: 400 });
    }

    const aufgaben = getAufgaben(fach, schulart.id as SchulartId, klasse, thema);

    // Noch keine geprüften Aufgaben → freundlich „bald verfügbar".
    if (!aufgaben || aufgaben.length === 0) {
      return NextResponse.json({ aufgaben: [], status: "bald" });
    }

    return NextResponse.json({
      status: "ok",
      modus: "interaktiv",
      aufgaben: aufgaben.map(aufbereiten),
    });
  } catch (error) {
    console.error("[quiz] Fehler:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ aufgaben: [], status: "fehler", grund: "Server-Fehler" }, { status: 500 });
  }
}
