import type { Request, Response } from "express";
import { asyncHandler } from "@/common/middleware/errorHandler.middleware";
import { stripe } from "@/config/stripe";
import { env } from "@/config/env";
import { handlerStripeEvent } from "./webhook.service";

export const handlerStripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(typeof req.body, Buffer.isBuffer(req.body));
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing signature" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed", err);
      return res
        .status(400)
        .json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    await handlerStripeEvent(event);
    res.status(200).json({ received: true });
  },
);
