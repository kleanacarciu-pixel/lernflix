import { NextResponse } from "next/server";
import { verfuegbareKeys, bestand } from "@/lib/quiz/store";

// Verfügbarkeits-Liste für die Oberfläche: welche (fach|schulart|klasse|thema)
// haben geprüfte Fragen? Ändert sich nur beim Deploy → statisch auslieferbar.
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return NextResponse.json({
    verfuegbar: verfuegbareKeys(),
    bestand: bestand(),
  });
}
