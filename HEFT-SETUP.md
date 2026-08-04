# Heft-Verkauf (`/heft`) — Einrichtung

Digitales PDF-Produkt „Masterclass-Heft Mathe Klasse 6" für 12,90 € (einmalige Zahlung).
Alles Nötige zum Scharfschalten. Reihenfolge einhalten.

## 1. Supabase

**a) SQL ausführen** (SQL-Editor):
Inhalt von [`supabase/product_purchases.sql`](supabase/product_purchases.sql) einfügen und *Run*.
→ Legt Tabelle `product_purchases` + Zähler-Funktion `increment_heft_download` an.

**b) Storage-Bucket anlegen:** Storage → **New bucket** → Name exakt **`products`** →
**Public bucket AUS** (privat!). → **Save**.

**c) PDF hochladen:** in den `products`-Bucket die Datei
**`Masterclass-Heft-Klasse6-Mathe.pdf`** laden (exakt dieser Name — sonst in
`lib/heft.ts` `PRODUCT.file` anpassen).

## 2. Environment-Variablen (Vercel → Settings → Environment Variables)

| Variable | Wert / Quelle | Status |
|----------|---------------|--------|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | ist schon gesetzt (Shop nutzt ihn) |
| `STRIPE_WEBHOOK_SECRET` | **neu** — aus dem Webhook-Endpoint (Schritt 3) | **ergänzen** |
| `RESEND_API_KEY` | ist schon gesetzt (Kalender nutzt ihn) | prüfen, dass vorhanden |
| `HEFT_MAIL_FROM` | z. B. `Lerne mit Anna <shop@lernemitanna.de>` | optional (Default vorhanden) |
| `HEFT_APP_URL` | `https://lernflix.lernemitanna.de` | optional (Default vorhanden) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | ist schon gesetzt | prüfen |

Nach dem Ergänzen von `STRIPE_WEBHOOK_SECRET`: **Redeploy**.

## 3. Stripe-Dashboard

**a) (Optional) Produkt anlegen** — nicht zwingend, weil der Checkout den Preis per
`price_data` dynamisch setzt (12,90 €). Ein Katalog-Produkt ist nur für die Übersicht.

**b) Webhook-Endpoint** (Pflicht): Developers → **Webhooks** → **Add endpoint**
- **URL:** `https://lernflix.lernemitanna.de/api/heft-webhook`
- **Event:** `checkout.session.completed`
- Nach dem Anlegen den **Signing secret** (`whsec_…`) kopieren → als `STRIPE_WEBHOOK_SECRET` in Vercel.

## 4. Testplan (Stripe-Testmodus)

> Voraussetzung: der in Vercel hinterlegte `STRIPE_SECRET_KEY` ist ein **Test-Key**
> (`sk_test_…`) und der Webhook-Endpoint ist im **Test**-Modus angelegt.

1. `https://lernflix.lernemitanna.de/heft` öffnen → **Jetzt kaufen**.
2. Im Stripe-Checkout Testkarte **`4242 4242 4242 4242`**, beliebiges künftiges
   Ablaufdatum, beliebige CVC, E-Mail eingeben → zahlen.
3. Weiterleitung auf **/heft/danke** → Download-Button erscheint → PDF lädt.
4. In Supabase: Tabelle `product_purchases` hat einen neuen Eintrag
   (`stripe_session_id`, `email`, `product_id = heft-mathe-6`).
5. **E-Mail** prüfen: Bestätigung mit Download-Link auf `/heft/download?session_id=…`
   kommt an; der Link dort lädt ebenfalls (frische URL).
6. Nach Klick auf Download: `download_count` in der Tabelle erhöht sich.
7. **Fehlerfall** testen: `/heft/danke?session_id=cs_falsch` → freundlicher Hinweis
   mit Support-Mail, **kein** Download.

Live-Schaltung: Test-Keys gegen Live-Keys tauschen und den Webhook zusätzlich im
**Live-Modus** anlegen (eigenes `whsec_…`).

## Dateien

- Produktseite: `app/heft/page.tsx` · Shop-Karte: `app/shop/page.tsx`
- Checkout: `app/api/checkout-heft/route.ts`
- Webhook: `app/api/heft-webhook/route.ts`
- Download-Verify: `app/api/heft-download/route.ts`
- Success/Download-Seiten: `app/heft/danke`, `app/heft/download` (+ `_download-box.tsx`)
- Server-Logik: `lib/heft.ts` · DB: `supabase/product_purchases.sql`

**Vorschaubilder:** In `app/heft/page.tsx` sind 3 Platzhalter markiert (`TODO`). Ersetze
sie durch echte Bilder (z. B. `public/heft-vorschau-1.png`) der ersten 3 PDF-Seiten.
