import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@/common/middleware/errorHandler.middleware";
import { registerUser, loginUser } from "./auth.service";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    const newUser = await registerUser(email, password, name);
    res.status(200).json({ success: true, data: newUser });
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.status(200).json({ success: true, data: user });
  },
);
