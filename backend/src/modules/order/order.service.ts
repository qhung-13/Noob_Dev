import prisma from "@/config/prisma";
import {
  ConflictError,
  NotFoundError,
  AppError,
} from "@/common/errors/AppError";
import { createCheckoutSession } from "./stripe.helper";

export const createOrderFromCartService = async (
  userId: string,
  shippingAddress: string,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty", 400, "EMPTY_CART");
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count === 0) {
        throw new ConflictError(`Invalid product ${item.product.name}`);
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        userId: userId,
        totalAmount: totalAmount,
        shippingAddress,
        status: "PENDING",
      },
    });

    await tx.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      })),
    });

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  const session = await createCheckoutSession({
    orderId: order.id,
    amount: Math.round(totalAmount * 100),
    currency: "usd",
  });

  await prisma.paymentIntent.create({
    data: {
      orderId: order.id,
      stripeSessionId: session.id,
      stripePaymentIntentId: (session.payment_intent as string) ?? "",
      status: "PENDING",
      amount: totalAmount,
    },
  });

  if (!session.url) {
    throw new AppError(
      "Failed to create checkout session",
      500,
      "STRIPE_ERROR",
    );
  }

  return { order, checkoutUrl: session.url };
};

export const getUserOrderService = async (userId: string) => {
  const orders = prisma.order.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};

export const getOrderByIdService = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    throw new NotFoundError("Order");
  }

  return order;
};
