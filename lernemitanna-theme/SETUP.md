# Lerne mit Anna – HubSpot CMS Theme

Dieses Theme basiert auf dem offiziellen [HubSpot CMS Theme Boilerplate](https://github.com/HubSpot/cms-theme-boilerplate)
und wurde an das Design von **Lerne mit Anna** angepasst.

Designkonzept **„Teacher's Annotation"**: ruhige, editoriale Basis mit viel
Weißraum, großen Serifen-Headlines und dezenten, handgezeichneten Türkis-Akzenten
(eingekreiste Zahl, sich selbst zeichnende Unterstreichung, kleine Pfeile).
Keine bunten Verläufe – ein einziger Akzentton.

## 1. Design-System

Zentrale Werte liegen in `src/fields.json` (Standardwerte, im Design Manager
editierbar) und `src/css/theme-overrides.css` / `src/css/components/_brand.css`.

### Farben
| Verwendung                | Farbe              | Wo gesetzt |
|---------------------------|--------------------|------------|
| Hintergrund / Header       | Weiß `#FFFFFF`     | Body-Default, `header.background` |
| Ruhige Flächen / Footer    | Beige `#F3EDE4`    | `global_colors.secondary` |
| Text & primäre Buttons     | Ink `#14110F`      | `global_colors.primary`, `buttons.background` |
| Akzent (Links, Icons, Annotationen) | Türkis `#1D9E75` (Vollton) | `_brand.css` / `theme-overrides.css` (`accent_color`) |

### Schriften
- **Überschriften (H1–H6):** `Playfair Display` (Serife) – `global_fonts.secondary`
- **Fließtext / Navigation / Buttons:** `Inter` (Sans-Serif) – `global_fonts.primary`

### Buttons
- Primär: ruhiger **Ink-Button** (`#14110F`), leicht abgerundet (`8px`),
  dezenter Hover-Lift – kein Verlauf. Modul: `src/modules/button.module`.
- Auf dem dunklen CTA-Band wird der Button automatisch hell.

## 2. Startseite (`src/templates/home.html`)

Die Startseite ist ein **Page-Template**; jede Sektion ist ein eigenes,
im Editor bearbeitbares Modul (Texte/Bilder über HubL-Felder):

| Reihenfolge | Modul (`src/modules/…`) | Inhalt |
|---|---|---|
| 1 | `hero.module`         | Eyebrow, Headline mit animierter Unterstreichung, Ink-Button + Text-Link, „Mathe-Test"-Block mit eingekreister Note |
| 2 | `trust-bar.module`    | 4 Kennzahlen (Erfahrung, Einzelunterricht, flexibel, Lernpläne) |
| 3 | `lernweg.module`      | 4 Karten (Nachhilfe, Kurse, Blog, Über mich) mit Icon, Hover-Lift, Pfeil |
| 4 | `ideal-list.module`   | „Ideal für dich, wenn …" – 7 Punkte mit Icons |
| 5 | `steps.module`        | „So starten wir gemeinsam" – 4 Schritte mit Verbindungslinie |
| 6 | `testimonials.module` | 3 Referenz-Karten mit Sternen |
| 7 | `cta-band.module`     | Abschluss-CTA auf Ink-Band |

**Header & Footer** sind globale Partials (`src/templates/partials/`):
- Sticky-Header (Schatten erst beim Scrollen), Logo links, Navigation
  *Leistungen, Kurse, Blog, Mehr* (Menü `default` unter
  *Einstellungen → Website → Navigationen* pflegen).
- Footer: Datenschutzerklärung, Impressum, AGB, Kontakt + „© Lerne mit Anna {{ year }}".

### Politur (`src/js/brand.js`, `_brand.css`)
- Sanftes Einblenden der Sektionen beim Scrollen (IntersectionObserver).
- Hover-Effekte auf Karten & Buttons, Smooth-Scroll für Anker-Links.
- Hero-Unterstreichung & eingekreiste Note als Inline-SVG mit
  `stroke-dashoffset`-Animation (zeichnen sich selbst).
- Mobile-first responsiv, Fokus-Stile und `prefers-reduced-motion` berücksichtigt.

> Icons liegen zentral als HubL-Makro in
> `src/templates/partials/brand-icons.html` (`brand_icon("name")`).

## 3. Theme lokal in der Vorschau ansehen

HubSpot-Templates (HubL) werden serverseitig gerendert. Für die Live-Vorschau wird
deshalb **einmalig ein (kostenloser) HubSpot-Account verbunden** – danach läuft die
Vorschau lokal und aktualisiert sich bei jeder Dateiänderung.

1. **HubSpot CLI installieren** (falls noch nicht geschehen):
   ```bash
   npm install -g @hubspot/cli
   ```
2. **Account verbinden** (öffnet den Browser, fragt nach einem Personal Access Key):
   ```bash
   hs init
   ```
   Tipp: Ein kostenloser [Developer-Test-Account](https://developers.hubspot.com/get-started)
   genügt zum Üben.
3. **Lokale Vorschau starten** (aus dem Projekt-Hauptordner):
   ```bash
   hs cms theme preview --src lernemitanna-theme/src --dest "Lerne mit Anna"
   ```
   Die CLI lädt das Theme hoch, startet einen lokalen Server und öffnet eine URL.
   Dateiänderungen werden automatisch übernommen – Seite neu laden genügt.
4. Zum Beenden im Terminal `Strg + C` drücken.

> Ohne verbundenen Account lassen sich die Dateien zwar bearbeiten, eine echte
> HubL-Vorschau ist aber nicht möglich, da Module, Navigation und Animationen
> serverseitig gerendert werden.
