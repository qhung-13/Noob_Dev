import { Router } from "express";
import { validate } from "@/common/middleware/validate.middleware";
import { authGuard, adminGuard } from "@/common/middleware/auth.middleware";
import {
  listProductsQueryDto,
  createProductDto,
  updateProductDto,
  productParamsDto,
} from "./product.dto";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";

export const productRouter = Router();

productRouter.get("/", validate(listProductsQueryDto), getProducts);
productRouter.get("/:id", validate(productParamsDto), getProductById);

productRouter.post(
  "/",
  authGuard,
  adminGuard,
  validate(createProductDto),
  createProduct,
);
productRouter.patch(
  "/:id",
  authGuard,
  adminGuard,
  validate(updateProductDto),
  updateProduct,
);
productRouter.delete(
  "/:id",
  authGuard,
  adminGuard,
  validate(productParamsDto),
  deleteProduct,
);
