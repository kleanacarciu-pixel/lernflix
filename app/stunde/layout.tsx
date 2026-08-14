import type { Metadata, Viewport } from "next";

// Teil der installierbaren App (siehe app/kalender/layout.tsx):
// gleiche App-Konfiguration, damit die Live-Stunde in der App bleibt.
export const metadata: Metadata = {
  title: "Live-Stunde – Lerne mit Anna",
  description: "Deine Live-Stunde mit Video, Übungen und Tafel.",
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

export default function StundeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
