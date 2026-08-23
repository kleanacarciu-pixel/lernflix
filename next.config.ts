import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Moderne, deutlich kleinere Formate automatisch ausliefern.
    formats: ["image/avif", "image/webp"],
  },

  // pdfkit lädt seine Schriftmaße (*.afm) zur Laufzeit über einen Dateipfad,
  // den es aus __dirname bildet. Wird das Paket mitgebündelt, zeigt __dirname
  // auf das Bündel und der Pfad geht ins Leere – auf Vercel scheiterte jedes
  // PDF mit
  //   ENOENT ... open '/ROOT/node_modules/pdfkit/js/data/Helvetica.afm'
  // Lokal fiel das nicht auf, weil dort ein echtes node_modules danebenliegt.
  //
  // Die Dateien mitzukopieren reicht NICHT – gesucht wird am falschen Ort.
  // pdfkit muss ungebündelt bleiben, damit __dirname stimmt.
  serverExternalPackages: ["pdfkit"],

  // Zusätzlich sicherstellen, dass die Schriftdateien im Server-Paket landen.
  outputFileTracingIncludes: {
    "/api/vertrag": ["./node_modules/pdfkit/js/data/**/*"],
    "/api/zahlungen": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
