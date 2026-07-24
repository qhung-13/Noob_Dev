import { z } from "zod";

export const listProductsQueryDto = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .min(1, "Page must be at least 1")
      .optional()
      .default(1),
    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1")
      .max(50, "Limit must not exceed 50")
      .optional()
      .default(10),
    categoryId: z.string().uuid("categoryId must be a valid UUID").optional(),
    search: z.string().optional(),
  }),
});

const productBodySchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(2, "Product name must be at least 2 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),
  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
  categoryId: z
    .string({ required_error: "CategoryID is required" })
    .uuid("CategoryID must be a valid UUID"),
  imageUrl: z.string().url("Invalid image URL format").optional(),
});

export const createProductDto = z.object({
  body: productBodySchema,
});

export const updateProductDto = z.object({
  params: z.object({
    id: z.string().uuid("Product ID in URL must be a valid UUID"),
  }),
  body: productBodySchema.partial(),
});

export const productParamsDto = z.object({
  params: z.object({
    id: z.string().uuid("Product ID in URL must be a valid UUID"),
  }),
});

export type CreateProductInput = z.infer<typeof productBodySchema>;
export type UpdateProductInput = z.infer<
  ReturnType<typeof productBodySchema.partial>
>;
export type ListProductsQuery = z.infer<typeof listProductsQueryDto>["query"];
