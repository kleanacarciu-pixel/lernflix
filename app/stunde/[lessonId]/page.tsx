"use client";
// =============================================================================
// Virtuelles Klassenzimmer – /stunde/[lessonId]
// Eigenständige Seite der Live-Stunde (Deep-Link aus Kalender und
// Erinnerungs-Mails). Die gesamte Oberfläche steckt im gemeinsamen Baustein
// LiveStunde (app/stunde/live-stunde.tsx) – derselbe Baustein läuft auch
// eingebettet im Klassenzimmer (/klassenzimmer).
// =============================================================================
import { useParams } from "next/navigation";
import LiveStunde from "../live-stunde";

export default function StundePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  return <LiveStunde lessonId={lessonId} />;
}
