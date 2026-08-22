import { NextResponse } from "next/server";
import type { Fach, SchulartId } from "@/lib/quiz/catalog";
import { schulartById, themaOhneEmoji } from "@/lib/quiz/catalog";
import { getFragen } from "@/lib/quiz/store";

// Kuratierte Fragen aus dem Repo — KEINE Live-KI, kein Supabase, keine ENV.
// POST läuft immer zur Laufzeit (Auswahl im Body), daher dynamisch.
export const dynamic = "force-dynamic";

// Wie viele Fragen ein Durchgang zeigt (aus dem Pool zufällig gezogen).
const FRAGEN_PRO_RUNDE = 10;

const FAECHER: Fach[] = ["mathe", "physik"];

type Frage = {
  frage: string;
  antworten: string[];
  richtig: number;
  erklaerung: string;
};

// Fisher-Yates — gleichverteilt mischen.
function mischen<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Antwort-Reihenfolge je Frage mischen, damit die richtige Antwort nicht
// immer an derselben Position steht. richtig-Index wird mitgeführt.
function antwortenMischen(f: Frage): Frage {
  const reihenfolge = mischen([0, 1, 2, 3]);
  const antworten = reihenfolge.map((i) => f.antworten[i]);
  const richtig = reihenfolge.indexOf(f.richtig);
  return { frage: f.frage, antworten, richtig, erklaerung: f.erklaerung };
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
    const schulartId = String(body.schulart ?? "");
    const schulart = schulartById(schulartId);
    const klasseRaw = parseInt(String(body.klasse ?? ""), 10);
    const thema = themaOhneEmoji(String(body.thema ?? ""));

    if (!schulart) {
      return NextResponse.json({ fragen: [], status: "fehler", grund: "Schulart fehlt" }, { status: 400 });
    }
    if (!Number.isFinite(klasseRaw) || !schulart.klassen.includes(klasseRaw)) {
      return NextResponse.json({ fragen: [], status: "fehler", grund: "Klasse ungültig" }, { status: 400 });
    }
    if (!thema) {
      return NextResponse.json({ fragen: [], status: "fehler", grund: "Thema fehlt" }, { status: 400 });
    }

    const alle = getFragen(fach, schulart.id as SchulartId, klasseRaw, thema);

    // Noch keine geprüften Fragen für diese Auswahl → freundlich „bald verfügbar".
    if (alle.length === 0) {
      return NextResponse.json({ fragen: [], status: "bald" });
    }

    const fragen = mischen(alle)
      .slice(0, FRAGEN_PRO_RUNDE)
      .map(antwortenMischen);

    return NextResponse.json({ fragen, status: "ok", quelle: "kuratiert" });
  } catch (error) {
    console.error("[quiz] Fehler:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ fragen: [], status: "fehler", grund: "Server-Fehler" }, { status: 500 });
  }
}
