import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCartApi, updateCartItemApi, removeCartItemApi } from "./cartApi";
import { createOrderApi } from "../orders/orderApi";

import type { CartItem } from "./cartApi";

export const CartPage = () => {
  const queryClient = useQueryClient();
  const [shippingAddress, setShippingAddress] = useState("");
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItemApi(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeQuantityMutation = useMutation({
    mutationFn: (id: string) => removeCartItemApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (address: string) => createOrderApi(address),
    onSuccess: (response) => {
      if (response?.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    },
    onError: () => {
      alert("Creating cart error, please checking again");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const cartItems = cartData?.data.items || [];

  const totalAmount = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + item.quantity * Number(item.product.price),
    0,
  );

  return (
    <div>
      <h1>Your cart</h1>

      {cartItems.length === 0 ? (
        <p>Empty cart</p>
      ) : (
        <div>
          <div>
            {cartItems.map((item: CartItem) => (
              <div key={item.id}>
                <div>
                  <div></div>
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>${Number(item.product.price)}</p>
                  </div>
                </div>

                <div>
                  <div>
                    <button
                      disabled={
                        item.quantity <= 1 || updateQuantityMutation.isPending
                      }
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      }
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      disabled={updateQuantityMutation.isPending}
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    disabled={removeQuantityMutation.isPending}
                    onClick={() => removeQuantityMutation.mutate(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2>Total carts</h2>
            <div>
              <span></span>
              <span>${totalAmount}</span>
            </div>

            <div>
              <label>Address</label>
              <textarea
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Input your address"
              ></textarea>
            </div>

            <button
              onClick={() => checkoutMutation.mutate(shippingAddress)}
              disabled={
                checkoutMutation.isPending ||
                cartItems.length === 0 ||
                !shippingAddress
              }
            >
              {checkoutMutation.isPending ? "Processing..." : "Payment now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
