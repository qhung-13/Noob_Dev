import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { getProductsApi } from "./productsApi";
import { addItemToCartApi } from "../cart/cartApi";

import type { Product } from "./productsApi";

export const ProductListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", page],
    queryFn: () => getProductsApi(page),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addItemToCartApi(productId, 1),
    onSuccess: () => {
      alert("Added to cart success");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        alert("You must to login to buy product");
        navigate("/login");
      } else {
        alert("Have errors, please try again later");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  const products: Product[] = productsResponse?.data || [];
  const totalPages = productsResponse?.meta.totalPages ?? 1;

  return (
    <div>
      <h1>Explore Products</h1>

      <div>
        {products.map((product) => (
          <div key={product.id}>
            <div>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div>No Image</div>
              )}
            </div>

            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button
                onClick={() => addToCartMutation.mutate(product.id)}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending
                  ? "Adding..."
                  : "Added to cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((old) => Math.max(old + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
