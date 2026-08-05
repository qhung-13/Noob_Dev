import { apiClient } from "../../lib/api/client";

export async function addItemToCartApi(productId: string, quantity: number) {
  const response = await apiClient.post("/cart/items", { productId, quantity });
  return response.data;
}
