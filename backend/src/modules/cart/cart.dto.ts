import { z } from "zod";

export const addItemDto = z.object({
  body: z.object({
    productId: z
      .string({ required_error: "Product ID is required" })
      .uuid("Product ID must be a valid UUID"),
    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"),
  }),
});

export const updateItemDto = z.object({
  params: z.object({
    id: z.string().uuid("Cart item ID in the URL must be a valid UUID"),
  }),
  body: z.object({
    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"), 
  }),
});

export const cartItemParamsDto = z.object({
  params: z.object({
    id: z.string().uuid("Cart item ID in the URL must be a valid UUID"),
  }),
});
