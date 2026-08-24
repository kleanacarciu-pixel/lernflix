// Widerrufsbelehrung und Muster-Widerrufsformular.
//
// Beides steht als Anlage 1 und 2 in den AGB (lib/agb-text.ts) und wird hier
// nur zusätzlich einzeln gezeigt – aus derselben Quelle, damit es keine
// zweite, abweichende Fassung gibt.
import { AGB_MARKDOWN, AGB_STAND } from '@/lib/agb-text';
import { anlage } from '@/lib/agb-kern';
import { Rechtstext } from '../agb-vertrag/rechtstext';

export const metadata = { title: 'Widerrufsbelehrung – Lerne mit Anna' };

export default function WiderrufSeite() {
  const text = [anlage(AGB_MARKDOWN, 'Anlage 1'), anlage(AGB_MARKDOWN, 'Anlage 2')].join('\n\n---\n\n');

  return (
    <Rechtstext
      titel="Widerrufsbelehrung"
      unterzeile={`Anlage zu den AGB für den Schuljahresvertrag · Stand ${AGB_STAND}`}
      markdown={text}
    />
  );
}
