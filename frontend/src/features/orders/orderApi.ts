import { apiClient } from "../../lib/api/client";

export async function createOrderApi(shippingAddress: string) {
  const response = await apiClient.post("/orders", { shippingAddress });
  return response.data;
}

