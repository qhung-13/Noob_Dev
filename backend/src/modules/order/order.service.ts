import prisma from "@/config/prisma";
import {
  ConflictError,
  NotFoundError,
  AppError,
} from "@/common/errors/AppError";

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

  const newOrder = await prisma.$transaction(async (tx) => {
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

    const order = await tx.order.create({
      data: {
        userId: userId,
        totalAmount: totalAmount,
        shippingAddress,
        status: "PENDING",
      },
    });

    const orderItemsData = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

  return newOrder;
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
