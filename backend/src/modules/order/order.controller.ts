import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@/common/middleware/errorHandler.middleware";
import {
  createOrderFromCartService,
  getUserOrderService,
  getOrderByIdService,
} from "./order.service";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { shippingAddress } = req.body;
  const order = await createOrderFromCartService(userId, shippingAddress);
  res.status(201).json({ success: true, data: order });
});

export const getUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const createOrder = await getUserOrderService(userId);
    return res.status(200).json({ success: true, data: createOrder });
  },
);

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const orderId = req.params.id;
  const order = await getOrderByIdService(userId, String(orderId));
  res.status(200).json({ success: true, data: order });
});
