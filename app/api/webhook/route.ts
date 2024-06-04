import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    if (!signature) {
        return new NextResponse("Missing Stripe-Signature header", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse("Webhook Error: Missing MetaData", { status: 400 });
        }

        try {
            await db.purchase.create({
                data: {
                    courseId,
                    userId
                }
            });
        } catch (error: any) {
            return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
        }
    } else {
        return new NextResponse(`Unhandled Event: ${event.type}`, { status: 400 });
    }

    return new NextResponse("Webhook handled", { status: 200 });
}
