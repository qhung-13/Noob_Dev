import type { Request, Response } from "express";
import { asyncHandler } from "@/common/middleware/errorHandler.middleware";
import {
  getCartByUserId,
  addItemToCart as addItemToCartService,
  updateCartItemQuantity,
  removeCartItem as removeCartItemService,
} from "./cart.service";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getCartByUserId(req.user!.userId);
  res.status(200).json({ success: true, data: cart });
});

export const addItemToCart = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const item = await addItemToCartService(
      req.user!.userId,
      productId,
      quantity,
    );
    res.status(201).json({ success: true, data: item });
  },
);

export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string; 
    const { quantity } = req.body;
    const item = await updateCartItemQuantity(req.user!.userId, id, quantity);
    res.status(200).json({ success: true, data: item });
  },
);

export const removeCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string; 
    const result = await removeCartItemService(req.user!.userId, id);
    res.status(200).json({ success: true, data: result });
  },
);
