import { NextResponse } from "next/server";
import Stripe from "stripe";

export const maxDuration = 30;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Bezahlung ist gerade nicht eingerichtet." }, { status: 500 });
    }
    const origin = request.headers.get("origin") || "https://lernflix.lernemitanna.de";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Lernheld-Plan",
              description: "Dein persönlicher Lernplan zur Schulaufgabe",
            },
            unit_amount: 199,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Lernheld-Plan - dein persoenlicher Lernplan",
          footer: "Vielen Dank fuer deinen Kauf bei Lernflix - lernemitanna.de",
        },
      },
      success_url: `${origin}/lernheld?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/lernheld`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Fehler:", error);
    return NextResponse.json({ error: "Die Bezahlung konnte nicht gestartet werden." }, { status: 500 });
  }
}
