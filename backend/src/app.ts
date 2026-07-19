import express from "express";
import cors from "cors";
// import { authRouter } from "@/modules/auth/auth.routes";
// import { productRouter } from "@/modules/product/product.routes";
import { cartRouter } from "@/modules/cart/cart.routes";
import { errorHandler } from "@/common/middleware/errorHandler.middleware";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  //   app.use("/api/v1/auth", authRouter);
  //   app.use("/api/v1/products", productRouter);
  app.use("/api/v1/cart", cartRouter);

  app.use((_req, res) => {
    res
      .status(404)
      .json({ success: false, message: "Route not found", code: "NOT_FOUND" });
  });

  app.use(errorHandler);

  return app;
}
