import { useQuery } from "@tanstack/react-query";
import { getOrdersApi } from "./orderApi";

export const OrderHistoryPage = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersApi,
  });

  const orders = response?.data ?? [];

  if (isLoading) {
    return <div>Loading cart history...</div>;
  }

  if (isError) {
    return <div>Have any errors. Please try again...</div>;
  }

  return (
    <div>
      <h1>Cart history</h1>

      {!orders || orders.length === 0 ? (
        <div>
          <p>You don't have any cart</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <div>
                <div>
                  <p>
                    Code: <span>{order.id}</span>
                  </p>
                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <span>{order.status}</span>

                  <p>${Number(order.totalAmount).toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4>Products have bought:</h4>

                {order.items.map((item) => (
                  <div key={item.id}>
                    <div>
                      <span>{item.product.name}</span>
                      <span>x {item.quantity}</span>
                    </div>
                    <span>
                      $
                      {(Number(item.priceAtPurchase) * item.quantity).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <p>
                  <span>Arrive to: </span>
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
