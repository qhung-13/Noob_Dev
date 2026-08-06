import { apiClient } from "../../lib/api/client";

export interface Order {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: string;
  shippingAddress: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: string;
    product: { name: string };
  }[];
}

export async function getOrdersApi() {
  const response = await apiClient.get<{ success: boolean; data: Order[] }>(
    "/orders",
  );
  return response.data;
}

export async function createOrderApi(shippingAddress: string) {
  const response = await apiClient.post("/orders", { shippingAddress });
  return response.data;
}
