import { Router } from "express";
import { validate } from "@/common/middleware/validate.middleware";
import { registerDto, loginDto } from "./auth.dto";
import { register, login } from "./auth.controller";
import { loginLimiter } from "@/common/middleware/rateLimiter.middleware";

export const authRouter = Router();

authRouter.post("/register", validate(registerDto), register);
authRouter.post("/login", loginLimiter, validate(loginDto), login);
