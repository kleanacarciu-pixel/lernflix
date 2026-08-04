import { Suspense } from 'react';
import DownloadBox from '../_download-box';

// Success-Seite nach dem Kauf (success_url aus dem Stripe-Checkout).
export default function DankePage() {
  return (
    <Suspense fallback={null}>
      <DownloadBox
        heading="Danke für deinen Kauf! 🎉"
        sub="Dein Masterclass-Heft ist bereit. Lade es hier direkt herunter — den Link findest du zusätzlich in deiner Bestätigungs-E-Mail."
      />
    </Suspense>
  );
}
