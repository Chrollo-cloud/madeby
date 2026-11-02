import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Creator from "./pages/Creator/Creator";
import Saved from "./pages/Saved/Saved";
import BecomeCreator from "./pages/BecomeCreator/BecomeCreator";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Payment/Payment";
import Order from "./pages/Order/Order";
import OrderSuccess from "./pages/Order/OrderSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AboutPage from "./pages/admin/AboutPage";

import RequireAdmin from "./components/admin/RequireAdmin";
import AdminLogin from "./pages/admin/AdminLogin";
import ProductForm from "./pages/admin/ProductForm";
import ProductEdit from "./pages/admin/ProductEdit";

function MarketplaceRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/creator/:id" element={<Creator />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/become-a-creator" element={<BecomeCreator />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="listings/new" element={<ProductForm />} />
          <Route path="listings/:id/edit" element={<ProductEdit />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<MarketplaceRoutes />} />
      </Routes>
    </>
  );
}
