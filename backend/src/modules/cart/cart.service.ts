import prisma from "@/config/prisma";
import { NotFoundError } from "@/common/errors/AppError";

export const getCartByUserId = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (cart) return cart;

  return prisma.cart.create({
    data: { userId },
    include: { items: { include: { product: true } } },
  });
};

async function getOrCreateCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) return cart;
  return prisma.cart.create({ data: { userId } });
}

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError("Product");

  const cart = await getOrCreateCart(userId);

  return prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
};

async function getOwnedCartItem(userId: string, cartItemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new NotFoundError("Cart item");
  }

  return item;
}

export const updateCartItemQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number,
) => {
  await getOwnedCartItem(userId, cartItemId);

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
};

export const removeCartItem = async (userId: string, cartItemId: string) => {
  await getOwnedCartItem(userId, cartItemId);

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  return { id: cartItemId };
};
