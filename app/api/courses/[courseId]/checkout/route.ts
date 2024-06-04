import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        
        const user = await currentUser();

        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        if(!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    courseId: params.courseId,
                    userId: user.id
                }
            }
        });

        if(purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title!,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true,
            }
        });

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            mode: "payment",
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            },
            customer: stripeCustomer?.stripeCustomerId as string // Type assertion
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.log("[COURSES_ID_CHECKOUT] Something went wrong", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
