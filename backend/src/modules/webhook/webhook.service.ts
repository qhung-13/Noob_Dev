import prisma from "@/config/prisma";
import Stripe from "stripe";
import { createCheckoutSession } from "@/modules/order/stripe.helper";
import { ConflictError } from "@/common/errors/AppError";

export const handlerStripeEvent = async (event: Stripe.Event) => {
  if (event.type !== "checkout.session.completed") {
    console.log(`[webhook] ignored event type: ${event.type}`);
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId) {
    console.error(`[webhook] missing orderId in metadata, event ${event.id}`);
    return;
  }

  const existingEvent = await prisma.processedWebhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    try {
      await tx.processedWebhookEvent.create({
        data: { stripeEventId: event.id },
      });
    } catch (error) {
      console.log(`[webhook] event ${event.id} already processed, skipping`);
      return;
    }

    const updateOrder = await tx.order.updateMany({
      where: {
        id: orderId,
        status: "PENDING",
      },
      data: {
        status: "PAID",
      },
    });

    if (updateOrder.count === 0) {
      console.warn("");
    }

    await tx.paymentIntent.updateMany({
      where: {
        orderId: orderId,
      },
      data: {
        status: "SUCCEEDED",
      },
    });

    await tx.outboxEvent.create({
      data: {
        eventType: "order.paid",
        payload: {
          orderId: orderId,
          userId: userId || "unknown",
          stripeSessionId: session.id,
        },
        status: "PENDING",
        correlationId: event.id,
      },
    });
  });
};
