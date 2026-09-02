import type { Metadata, Viewport } from "next";

// Teil der installierbaren App (siehe app/kalender/layout.tsx):
// gleiche App-Konfiguration, damit das Klassenzimmer in der App bleibt.
export const metadata: Metadata = {
  title: "Klassenzimmer – Lerne mit Anna",
  description: "Dein Klassenzimmer: Chat, Materialien, Aufgaben und Live-Stunden.",
  manifest: "/manifest-app.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anna",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  // Als installierte App bis in die Geräteränder zeichnen (Kerbe/Home-Balken);
  // die festen Elemente halten per safe-area-inset Abstand.
  viewportFit: "cover",
};

export default function KlassenzimmerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
