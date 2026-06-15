This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Content-Engine (Phase 1)

Aus einem Themen-Queue erzeugt die Engine automatisch ein fertiges, fachlich
geprüftes Short-Paket (noch **kein** Video, noch **kein** Posten).

**Ablauf:** `GET /api/generate` → nimmt das nächste `pending`-Topic →
`generatePaket()` (`lib/brain.ts`) erstellt Hook/Skript/On-Screen-Texte →
`checkMathe()` (`lib/qa.ts`) prüft die Mathematik fachlich → Ergebnis landet in
`content_log`, das Topic wird auf `done` (QA ok) oder `failed` gesetzt.

Modell für beide Schritte: `claude-sonnet-4-6`. Alle Keys werden **nur**
serverseitig gelesen.

### Setup (das muss Kleana manuell machen)

1. **Supabase-SQL ausführen.** Im Supabase SQL-Editor den Inhalt von
   [`supabase/content_engine_schema.sql`](supabase/content_engine_schema.sql)
   ausführen. Das legt die Tabellen `topics` + `content_log` an und seedet die
   8 Themen (Klasse 9) als `pending`.
2. **`.env` füllen.** [`.env.example`](.env.example) nach `.env` kopieren und
   die drei Keys eintragen:
   - `ANTHROPIC_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (Service-Role-Key, nicht den anon-Key!)
3. **Starten:** `npm install` (falls noch nicht geschehen), dann `npm run dev`.
4. **Testen:** im Browser `http://localhost:3000/api/generate` öffnen. Du
   solltest ein geprüftes Short-Paket sehen — und in Supabase einen neuen
   Eintrag in `content_log` mit `qa_ok = true`. Jeder weitere Aufruf arbeitet
   das nächste Topic ab. Sind alle Themen abgearbeitet, kommt `{ done: true }`.

> **Phase 2** (JSON2Video → fertiges MP4) folgt, sobald dieser Durchlauf sauber läuft.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
