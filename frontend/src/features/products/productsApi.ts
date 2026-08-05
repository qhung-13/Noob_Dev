import { apiClient } from "../../lib/api/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getProductsApi(page = 1) {
  const response = await apiClient.get<ProductsResponse>("/products", {
    params: { page },
  });
  return response.data;
}
