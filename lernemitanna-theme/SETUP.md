# Lerne mit Anna – HubSpot CMS Theme

Dieses Theme basiert auf dem offiziellen [HubSpot CMS Theme Boilerplate](https://github.com/HubSpot/cms-theme-boilerplate)
und wurde an das Design von **Lerne mit Anna** angepasst.

## 1. Design-System

Alle zentralen Werte werden über `src/fields.json` (Standardwerte) und
`src/css/theme-overrides.css` (Ausgabe-CSS) gesteuert und sind im HubSpot
Design Manager bearbeitbar.

### Farben
| Verwendung            | Farbe                              | Wo gesetzt |
|-----------------------|------------------------------------|------------|
| Hintergrund           | Weiß `#FFFFFF` (Seiteninhalt)      | Body-Default |
| Flächen / Header / Footer | Beige `#F3EDE4`                | `global_colors.secondary` |
| Text                  | Schwarz `#1A1A1A`                  | `global_colors.primary` |
| Akzent (Buttons/Icons)| Türkis-Verlauf `#2BB3C0 → #3E7BB6` | `theme-overrides.css` (`accent_gradient`) |

> Der Türkis-Verlauf ist als `linear-gradient(135deg, #2BB3C0 0%, #3E7BB6 100%)`
> zentral in `src/css/theme-overrides.css` (Abschnitt „1d. Buttons") definiert.
> Beide Farbstopps dort an einer Stelle änderbar.

### Schriften
- **Überschriften (H1–H6):** `Playfair Display` (Serife) – `global_fonts.secondary`
- **Fließtext / Navigation / Buttons:** `Inter` (Sans-Serif) – `global_fonts.primary`

Beide werden automatisch von Google Fonts geladen.

### Button-Modul
Wiederverwendbares Modul unter `src/modules/button.module`:
- Standard: Türkis-Verlauf, weiße Schrift, stark abgerundete Ecken (`border-radius: 50px`).
- Editor-Override: Wird im Editor eine Hintergrundfarbe gewählt, ersetzt eine
  einfarbige Fläche den Verlauf.

## 2. Layout (globale Module)

- **Header** (`src/templates/partials/header.html`): Logo links, Navigation rechts.
  Die Menüpunkte **Leistungen, Kurse, Blog, Mehr** werden in HubSpot unter
  *Einstellungen → Website → Navigationen* im Menü `default` gepflegt.
- **Footer** (`src/templates/partials/footer.html`): Links zu *Datenschutzerklärung,
  Impressum, AGB, Kontakt* sowie der Copyright-Hinweis „© Lerne mit Anna {{ year }}".

Header und Footer sind globale Partials und damit auf allen Seiten im Editor
zentral bearbeitbar.

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
   Die CLI lädt das Theme hoch, startet einen lokalen Server und öffnet eine URL
   (z. B. `https://localhost:...`). Änderungen an Dateien werden automatisch
   übernommen – Seite neu laden genügt.

4. Zum Beenden im Terminal `Strg + C` drücken.

> Hinweis: Ohne verbundenen Account lassen sich die Dateien zwar bearbeiten, eine
> echte HubL-Vorschau ist aber nicht möglich, da der Verlauf, die Module und die
> Navigation serverseitig gerendert werden.
