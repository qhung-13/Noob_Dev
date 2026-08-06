import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProductListPage } from "../features/products/ProductListPage";
import { CartPage } from "../features/cart/CartPage";
import { OrderHistoryPage } from "../features/orders/OrderHistoryPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/carts" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
};
