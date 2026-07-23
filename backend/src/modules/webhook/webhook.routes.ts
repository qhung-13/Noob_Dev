import { Router } from "express";
import { handlerStripeWebhook } from "./webhook.controller";

export const webhookRouter = Router();

webhookRouter.post("/stripe", handlerStripeWebhook);
