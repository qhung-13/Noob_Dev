import prisma from "@/config/prisma";
import Stripe from "stripe";

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

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    console.error(`[webhook] Order not found: ${orderId}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    try {
      await tx.processedWebhookEvent.create({
        data: { stripeEventId: event.id },
      });
    } catch {
      console.log(`[webhook] event ${event.id} already processed, skipping`);
      return;
    }

    const updateOrder = await tx.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: { status: "PAID" },
    });

    if (updateOrder.count === 0) {
      console.warn(
        `[webhook] order ${orderId} not in PENDING state, skip status update`,
      );
    }

    await tx.paymentIntent.updateMany({
      where: { orderId },
      data: { status: "SUCCEEDED" },
    });

    await tx.outboxEvent.create({
      data: {
        eventType: "order.paid",
        payload: {
          orderId,
          userId: userId ?? "unknown",
          stripeSessionId: session.id,
          customerEmail: order.user.email,
        },
        status: "PENDING",
        correlationId: event.id,
      },
    });
  });
};