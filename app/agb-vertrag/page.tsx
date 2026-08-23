// AGB für den Schuljahresvertrag (Nachhilfe).
// Nicht zu verwechseln mit /agb – das sind die AGB des Shops (digitale Materialien).
// Text aus lib/vertrag-texte.ts – dieselbe Quelle wie das PDF im Anhang.
import { AGB_VERTRAG, AGB_STAND } from '@/lib/vertrag-texte';
import { Rechtstext } from './rechtstext';

export const metadata = { title: 'AGB Schuljahresvertrag – Lerne mit Anna' };

export default function AgbVertragSeite() {
  return (
    <Rechtstext
      titel="Allgemeine Geschäftsbedingungen"
      unterzeile={`Für den Schuljahresvertrag über Nachhilfeunterricht · Stand ${AGB_STAND}`}
      abschnitte={AGB_VERTRAG}
    />
  );
}
