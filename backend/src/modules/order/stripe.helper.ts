import { stripe } from "@/config/stripe";

export async function createCheckoutSession(params: {
  orderId: string;
  amount: number;
  currency: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: params.currency,
          product_data: { name: `Order #${params.orderId}` },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    success_url:
      "http://localhost:5173/order-success?orderId=" + params.orderId,
    cancel_url: "http://localhost:5173/cart",
    metadata: { orderId: params.orderId },
  });
}
