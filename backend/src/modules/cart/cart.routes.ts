import { Router } from "express";
import { authGuard } from "@/common/middleware/auth.middleware";
import { validate } from "@/common/middleware/validate.middleware";
import { addItemDto, updateItemDto, cartItemParamsDto } from "./cart.dto";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "./cart.controller";

export const cartRouter = Router();

cartRouter.use(authGuard);

cartRouter.get("/", getCart);
cartRouter.post("/items", validate(addItemDto), addItemToCart);
cartRouter.patch("/items/:id", validate(updateItemDto), updateCartItem);
cartRouter.delete("/items/:id", validate(cartItemParamsDto), removeCartItem);
