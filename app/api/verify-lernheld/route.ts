import { NextResponse } from "next/server";
import Stripe from "stripe";

export const maxDuration = 15;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    const body = await request.json();
    const sessionId = (body.session_id || "").toString();
    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bezahlt = session.payment_status === "paid";
    return NextResponse.json({ ok: bezahlt });
  } catch (error) {
    console.error("Verify Fehler:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
