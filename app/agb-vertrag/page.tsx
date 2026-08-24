// AGB für den Schuljahresvertrag (Nachhilfe).
// Nicht zu verwechseln mit /agb – das sind die AGB des Shops (digitale Materialien).
//
// Der Wortlaut kommt aus lib/agb-text.ts – derselben Quelle wie die PDF im
// Anhang und der Download beim Unterzeichnen. Hier wird nur dargestellt.
import { AGB_MARKDOWN, AGB_TITEL, AGB_UNTERZEILE } from '@/lib/agb-text';
import { Rechtstext } from './rechtstext';

export const metadata = { title: 'AGB Schuljahresvertrag – Lerne mit Anna' };

export default function AgbVertragSeite() {
  return (
    <Rechtstext
      titel={AGB_TITEL}
      unterzeile={AGB_UNTERZEILE}
      markdown={AGB_MARKDOWN}
    />
  );
}
