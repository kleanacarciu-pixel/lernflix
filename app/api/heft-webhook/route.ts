import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCT, recordPurchase, sendPurchaseEmail } from "@/lib/heft";

// Stripe-SDK braucht Node-Runtime; Signaturprüfung braucht den ROHEN Body.
export const runtime = "nodejs";
export const maxDuration = 30;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[heft-webhook] STRIPE_WEBHOOK_SECRET fehlt");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await request.text(); // ROHER Body für die Signaturprüfung
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[heft-webhook] Signatur ungültig:", String(e));
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Nur unser Heft-Produkt und nur bezahlte Sessions verarbeiten.
    if (session.metadata?.product_id === PRODUCT.id && session.payment_status === "paid") {
      const email = session.customer_details?.email ?? null;
      try {
        const neu = await recordPurchase(session.id, email); // idempotent (unique)
        if (neu && email) {
          const r = await sendPurchaseEmail(email, session.id);
          if (!r.ok) console.error("[heft-webhook] E-Mail-Fehler:", r.error);
        }
      } catch (e) {
        // Fehler -> 500, damit Stripe das Event erneut zustellt (Idempotenz schützt).
        console.error("[heft-webhook] Verarbeitung fehlgeschlagen:", String(e));
        return NextResponse.json({ error: "processing failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
