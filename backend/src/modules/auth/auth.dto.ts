import { z } from "zod";

export const registerDto = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name mus be at least 2 characters long"),
  }),
});

export const loginDto = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password cannot be empty"),
  }),
});
