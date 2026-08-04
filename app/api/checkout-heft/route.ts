import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCT } from "@/lib/heft";

// Muster wie app/api/checkout-material/route.ts
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
            currency: PRODUCT.currency,
            product_data: { name: PRODUCT.name },
            unit_amount: PRODUCT.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Käufer-E-Mail erfasst Stripe Checkout automatisch (kein Login nötig).
      billing_address_collection: "required",
      // product_id ins Metadata -> der Webhook weiss, welches Produkt gekauft wurde.
      metadata: { product_id: PRODUCT.id },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: PRODUCT.name,
          footer: "Vielen Dank fuer deinen Kauf bei Lerne mit Anna - lernemitanna.de",
        },
      },
      success_url: `${origin}/heft/danke?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/heft`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout-heft] Stripe Fehler:", error);
    return NextResponse.json({ error: "Die Bezahlung konnte nicht gestartet werden." }, { status: 500 });
  }
}
