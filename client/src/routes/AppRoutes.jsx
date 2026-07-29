import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Products from "../pages/Products/Products";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";
// Authentication
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import AddProduct from "../pages/Admin/AddProduct";
import ProductList from "../pages/Admin/ProductList";
import EditProduct from "../pages/Admin/EditProduct";
import MemberDashboard from "../pages/Dashboard/MemberDashboard";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ProductDetails from "../pages/Products/ProductDetails";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Website Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route
  path="/admin/products/edit/:id"
  element={<EditProduct />}
/>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;