import { NextResponse } from "next/server";
import Stripe from "stripe";

export const maxDuration = 30;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const MATERIALIEN: Record<string, { name: string; preis: number }> = {
  geometrie: { name: "Geometrie Formelsammlung — Klasse 6 bis 9", preis: 199 },
  potenzen: { name: "Potenzen — Komplettes Lernpaket", preis: 99 },
  mechanik: { name: "Mechanik — Komplettes Lernpaket", preis: 99 },
  brueche: { name: "Brüche & Bruchrechnung — Lernpaket", preis: 199 },
  prozent: { name: "Prozent- & Zinsrechnung — Lernpaket", preis: 99 },
  gleichungen: { name: "Gleichungen & Terme — Lernpaket", preis: 199 },
  funktionen: { name: "Funktionen (linear & quadratisch) — Lernpaket", preis: 199 },
  stochastik: { name: "Wahrscheinlichkeit & Statistik — Lernpaket", preis: 99 },
  trigonometrie: { name: "Trigonometrie — Lernpaket", preis: 99 },
  elektrizitaet: { name: "Elektrizität & Stromkreise — Lernpaket", preis: 199 },
  optik: { name: "Optik & Wellen — Lernpaket", preis: 99 },
  waerme: { name: "Wärmelehre — Lernpaket", preis: 99 },
  atomphysik: { name: "Atomphysik & Strahlung — Lernpaket", preis: 99 },
};

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Bezahlung ist gerade nicht eingerichtet." }, { status: 500 });
    }
    const body = await request.json();
    const id = (body.id || "").toString();
    const material = MATERIALIEN[id];
    if (!material) return NextResponse.json({ error: "Material nicht gefunden" }, { status: 400 });

    const origin = request.headers.get("origin") || "https://lernflix.lernemitanna.de";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: material.name },
            unit_amount: material.preis,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: material.name,
          footer: "Vielen Dank fuer deinen Kauf bei Lernflix - lernemitanna.de",
        },
      },
      success_url: `${origin}/materialien/${id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/materialien/${id}`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Fehler:", error);
    return NextResponse.json({ error: "Die Bezahlung konnte nicht gestartet werden." }, { status: 500 });
  }
}
