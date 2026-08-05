import { apiClient } from "../../lib/api/client";

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

export interface CartData {
  id: string;
  items: CartItem[];
}

interface CartResponse {
  success: boolean;
  data: CartData;
}

export async function getCartApi() {
  const response = await apiClient.get<CartResponse>("/cart");
  return response.data;
}

export async function updateCartItemApi(itemId: string, quantity: number) {
  const response = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
  return response.data;
}

export async function removeCartItemApi(itemId: string) {
  const response = await apiClient.delete(`/cart/items/${itemId}`);
  return response.data;
}

export async function addItemToCartApi(productId: string, quantity: number) {
  const response = await apiClient.post("/cart/items", { productId, quantity });
  return response.data;
}
