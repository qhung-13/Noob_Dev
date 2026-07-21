import { z } from "zod";

export const createOrderDto = z.object({
  body: z.object({
    shippingAddress: z
      .string({ required_error: "Shipping address is required" })
      .min(10, "Shipping address must be at least 10 characters long"),
  }),
});

export const orderParamsDto = z.object({
  params: z.object({ id: z.string().uuid("Order ID must be a valid UUID") }),
});
