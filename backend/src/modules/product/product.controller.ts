import type { Request, Response } from "express";
import { asyncHandler } from "@/common/middleware/errorHandler.middleware";
import {
  listProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "./product.service";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await listProductsService(req.query as any);
  res
    .status(200)
    .json({ success: true, data: result.products, meta: result.meta });
});

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await getProductByIdService(id);
    res.status(200).json({ success: true, data: product });
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await createProductService(req.body);
    res.status(201).json({ success: true, data: product });
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await updateProductService(id, req.body);
    res.status(200).json({ success: true, data: product });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await deleteProductService(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  },
);
