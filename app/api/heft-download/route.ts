import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCT, recordPurchase, freshDownloadUrl, SUPPORT_EMAIL } from "@/lib/heft";

// Verifiziert die Stripe-Session serverseitig (Muster wie verify-lernheld),
// erzeugt dann eine FRISCHE 24h-Signed-URL. Wird von /heft/danke und
// /heft/download genutzt -> Link bleibt dauerhaft nutzbar.
export const runtime = "nodejs";
export const maxDuration = 20;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "Bezahlung ist gerade nicht eingerichtet." }, { status: 500 });
    }
    const body = await request.json().catch(() => ({}));
    const sessionId = (body.session_id || "").toString();
    if (!sessionId.startsWith("cs_")) {
      return NextResponse.json({ ok: false, error: "Ungültiger Download-Link." }, { status: 400 });
    }

    // Stripe ist die Quelle der Wahrheit — unabhängig vom Webhook.
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bezahlt = session.payment_status === "paid" && session.metadata?.product_id === PRODUCT.id;
    if (!bezahlt) {
      return NextResponse.json(
        { ok: false, error: `Zu diesem Link wurde kein bezahlter Kauf gefunden. Bei Fragen: ${SUPPORT_EMAIL}` },
        { status: 403 },
      );
    }

    // Falls der Webhook noch nicht durch ist: Eintrag hier nachziehen (idempotent).
    try {
      await recordPurchase(sessionId, session.customer_details?.email ?? null);
    } catch (e) {
      console.error("[heft-download] recordPurchase:", String(e));
    }

    const url = await freshDownloadUrl(sessionId); // frische 24h-URL + Zähler +1
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error("[heft-download] Fehler:", error);
    return NextResponse.json(
      { ok: false, error: `Der Download konnte nicht erzeugt werden. Bitte versuche es später erneut oder schreib an ${SUPPORT_EMAIL}.` },
      { status: 500 },
    );
  }
}
