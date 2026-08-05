import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProductListPage } from "../features/products/ProductListPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductListPage />} />
        {/* thêm /products, /cart, /orders sau khi viết xong các trang đó */}
      </Routes>
    </BrowserRouter>
  );
};
