import { Routes, Route } from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import MemberLayout from "../layouts/MemberLayout";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";

// =====================================================
// PRODUCT
// =====================================================

import ProductDetails from "../components/products/ProductDetails";

// =====================================================
// PAYMENT
// =====================================================

import PaymentScanner from "../pages/Payment/PaymentScanner";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";

// =====================================================
// MEMBER
// =====================================================

import MemberDashboard from "../pages/Member/Dashboard";
import MemberProfile from "../pages/Member/Profile";
import MemberNetwork from "../pages/Member/Network";
import MemberProducts from "../pages/Member/Products";
import MemberOrders from "../pages/Member/Orders";
import MemberCommission from "../pages/Member/Commission";
import MemberSellingPoints from "../pages/Member/SellingPoints";
import MemberWallet from "../pages/Member/Wallet";
import MemberWithdraw from "../pages/Member/Withdraw";
import MemberWelcomeKit from "../pages/Member/WelcomeKit";
import MemberReports from "../pages/Member/Reports";
import MemberSettings from "../pages/Member/Settings";

// =====================================================
// ADMIN
// =====================================================

import Dashboard from "../pages/Admin/Dashboard";
import AdminProfile from "../pages/Admin/Profile";

import ProductList from "../pages/Admin/ProductList";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";

import Members from "../pages/Admin/Members";
import EditMember from "../pages/Admin/EditMember";

import Reports from "../pages/Admin/Reports";
import ReferralTreePage from "../pages/Admin/ReferralTreePage";
import AdminOrders from "../pages/Admin/Orders";

// =====================================================
// MANAGER
// =====================================================

import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerMembers from "../pages/manager/Members";
import ManagerProfile from "../pages/manager/Profile";
import ManagerReferralTreePage from "../pages/manager/ReferralTreePage";
import ManagerOrders from "../pages/manager/Orders";
import ManagerProducts from "../pages/manager/Products";
import Commissions from "../pages/manager/Commissions";
import ManagerMemberDetails from "../pages/manager/MemberDetails";

// =====================================================
// ERROR
// =====================================================

import NotFound from "../pages/NotFound/NotFound";

// =====================================================
// PHONEPE
// =====================================================

import PhonePeCallback from "../pages/Checkout/PhonePeCallback";

// =====================================================
// AUTH PROTECTION
// =====================================================

import ProtectedRoute from "../components/auth/ProtectedRoute";


// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}

      <Route element={<MainLayout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* PRODUCTS */}

        <Route
          path="/products"
          element={<Products />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* ORDERS */}

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      {/* PHONEPE CALLBACK */}

      <Route
        path="/checkout/phonepe-callback"
        element={<PhonePeCallback />}
      />

      {/* PAYMENT SCANNER */}

      <Route
        path="/payment-scanner"
        element={<PaymentScanner />}
      />


      {/* =====================================================
          MEMBER AREA
      ===================================================== */}

      <Route
        path="/member"
        element={<MemberLayout />}
      >

        {/* MEMBER HOME */}

        <Route
          index
          element={<MemberDashboard />}
        />

        {/* DASHBOARD */}

        <Route
          path="dashboard"
          element={<MemberDashboard />}
        />

        {/* PROFILE */}

        <Route
          path="profile"
          element={<MemberProfile />}
        />

        {/* NETWORK */}

        <Route
          path="network"
          element={<MemberNetwork />}
        />

        {/* PRODUCTS */}

        <Route
          path="products"
          element={<MemberProducts />}
        />

        {/* ORDERS */}

        <Route
          path="orders"
          element={<MemberOrders />}
        />

        {/* COMMISSION */}

        <Route
          path="commission"
          element={<MemberCommission />}
        />

        {/* SELLING POINTS */}

        <Route
          path="selling-points"
          element={<MemberSellingPoints />}
        />

        {/* WALLET */}

        <Route
          path="wallet"
          element={<MemberWallet />}
        />

        {/* WITHDRAW */}

        <Route
          path="withdraw"
          element={<MemberWithdraw />}
        />

        {/* WELCOME KIT */}

        <Route
          path="welcome-kit"
          element={<MemberWelcomeKit />}
        />

        {/* REPORTS */}

        <Route
          path="reports"
          element={<MemberReports />}
        />

        {/* SETTINGS */}

        <Route
          path="settings"
          element={<MemberSettings />}
        />

        {/* MEMBER CART */}

        <Route
          path="cart"
          element={<Cart />}
        />

        {/* MEMBER CHECKOUT */}

        <Route
          path="checkout"
          element={<Checkout />}
        />

      </Route>


      {/* =====================================================
          ADMIN AREA
          
          IMPORTANT:
          Both ADMIN and SUPER_ADMIN are allowed.
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "SUPER_ADMIN",
            ]}
          />
        }
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* =================================================
              ADMIN DEFAULT
          ================================================= */}

          <Route
            index
            element={<Dashboard />}
          />


          {/* =================================================
              ADMIN DASHBOARD
              
              /admin/dashboard
          ================================================= */}

          <Route
            path="dashboard"
            element={<Dashboard />}
          />


          {/* =================================================
              ADMIN PROFILE
              
              /admin/profile
              
              THIS WAS MISSING.
          ================================================= */}

          <Route
            path="profile"
            element={<AdminProfile />}
          />


          {/* =================================================
              ADMIN ORDERS
              
              /admin/orders
          ================================================= */}

          <Route
            path="orders"
            element={<AdminOrders />}
          />


          {/* =================================================
              ADMIN PRODUCTS
              
              /admin/products
          ================================================= */}

          <Route
            path="products"
            element={<ProductList />}
          />


          {/* =================================================
              ADD PRODUCT
              
              /admin/products/add
          ================================================= */}

          <Route
            path="products/add"
            element={<AddProduct />}
          />


          {/* =================================================
              EDIT PRODUCT
              
              /admin/products/edit/:id
          ================================================= */}

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />


          {/* =================================================
              ADMIN MEMBERS
              
              /admin/members
          ================================================= */}

          <Route
            path="members"
            element={<Members />}
          />


          {/* =================================================
              EDIT MEMBER
              
              /admin/members/:id
          ================================================= */}

          <Route
            path="members/:id"
            element={<EditMember />}
          />


          {/* =================================================
              ADMIN REFERRAL TREE
              
              /admin/referral-tree
          ================================================= */}

          <Route
            path="referral-tree"
            element={<ReferralTreePage />}
          />


          {/* =================================================
              ADMIN REPORTS
              
              /admin/reports
          ================================================= */}

          <Route
            path="reports"
            element={<Reports />}
          />

        </Route>

      </Route>


      {/* =====================================================
          MANAGER AREA
          
          DO NOT MODIFY THE EXISTING MANAGER ROUTING.
      ===================================================== */}

      <Route
        path="/manager"
        element={<ManagerLayout />}
      >

        {/* MANAGER HOME */}

        <Route
          index
          element={<ManagerDashboard />}
        />

        {/* DASHBOARD */}

        <Route
          path="dashboard"
          element={<ManagerDashboard />}
        />

        {/* MEMBERS */}

        <Route
          path="members"
          element={<ManagerMembers />}
        />

        {/* MEMBER DETAILS */}

        <Route
          path="members/:id/details"
          element={<ManagerMemberDetails />}
        />

        {/* ORDERS */}

        <Route
          path="orders"
          element={<ManagerOrders />}
        />

        {/* PRODUCTS */}

        <Route
          path="products"
          element={<ManagerProducts />}
        />

        {/* COMMISSIONS */}

        <Route
          path="commissions"
          element={<Commissions />}
        />

        {/* PROFILE */}

        <Route
          path="profile"
          element={<ManagerProfile />}
        />

        {/* REFERRAL TREE */}

        <Route
          path="referral-tree"
          element={<ManagerReferralTreePage />}
        />

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};


export default AppRoutes;