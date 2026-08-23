// Widerrufsbelehrung zum Schuljahresvertrag.
// Text aus lib/vertrag-texte.ts – dieselbe Quelle wie das PDF im Anhang.
import { WIDERRUF } from '@/lib/vertrag-texte';
import { Rechtstext } from '@/app/agb-vertrag/rechtstext';

export const metadata = { title: 'Widerrufsbelehrung – Lerne mit Anna' };

export default function WiderrufSeite() {
  return (
    <Rechtstext
      titel="Widerrufsbelehrung"
      unterzeile="Für den Schuljahresvertrag über Nachhilfeunterricht"
      abschnitte={WIDERRUF}
    />
  );
}
