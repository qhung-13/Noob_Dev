import { Router } from "express";
import { validate } from "@/common/middleware/validate.middleware";
import { authGuard } from "@/common/middleware/auth.middleware";
import { createOrder, getOrder, getUserOrder } from "./order.controller";
import { createOrderDto, orderParamsDto } from "./order.dto";

export const orderRouter = Router();

orderRouter.use(authGuard);

orderRouter.post("/", validate(createOrderDto), createOrder);
orderRouter.get("/", getUserOrder);
orderRouter.get("/:id", validate(orderParamsDto), getOrder);
