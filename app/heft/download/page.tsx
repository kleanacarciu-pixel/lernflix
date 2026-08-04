import { Suspense } from 'react';
import DownloadBox from '../_download-box';

// Ziel des Links aus der Bestätigungs-E-Mail — gleicher Verifizierungs-Flow,
// erzeugt jedes Mal eine frische 24h-URL (bleibt also dauerhaft nutzbar).
export default function DownloadPage() {
  return (
    <Suspense fallback={null}>
      <DownloadBox
        heading="Dein Masterclass-Heft"
        sub="Klick auf den Button, um dein Heft herunterzuladen. Der Link wird jedes Mal frisch und sicher erzeugt."
      />
    </Suspense>
  );
}
