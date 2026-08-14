import type { Metadata, Viewport } from "next";

// Kalender + Klassenzimmer sind zusammen als App installierbar ("Zum
// Home-Bildschirm hinzufügen") – eigene App-Konfiguration, getrennt vom
// Lernplan (der behält /manifest.json aus dem Root-Layout).
export const metadata: Metadata = {
  title: "Terminkalender – Lerne mit Anna",
  description: "Stunden buchen und verwalten – dein Terminkalender bei Lerne mit Anna.",
  manifest: "/manifest-app.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anna",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function KalenderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
