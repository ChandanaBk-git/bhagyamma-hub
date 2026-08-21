import { Routes, Route, Navigate } from "react-router-dom";

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
import PhonePeCallback from "../pages/Checkout/PhonePeCallback";

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

        {/* CONTACT */}

        <Route
          path="/contact"
          element={<Contact />}
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

        {/* PAYMENT SCANNER */}

        <Route
          path="/payment"
          element={<PaymentScanner />}
        />

        {/* PHONEPE CALLBACK */}

        <Route
          path="/payment/phonepe/callback"
          element={<PhonePeCallback />}
        />

      </Route>


      {/* =====================================================
          AUTH
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


      {/* =====================================================
          MEMBER AREA
          GREEN SIDEBAR
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["MEMBER"]}
          />
        }
      >

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

          {/* CART */}

          <Route
            path="cart"
            element={<Cart />}
          />

          {/* CHECKOUT */}

          <Route
            path="checkout"
            element={<Checkout />}
          />

          {/* UNKNOWN MEMBER PAGE */}

          <Route
            path="*"
            element={
              <Navigate
                to="/member"
                replace
              />
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          ADMIN AREA
          RED SIDEBAR
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

          {/* ADMIN HOME */}

          <Route
            index
            element={<Dashboard />}
          />

          {/* DASHBOARD */}

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* PROFILE */}

          <Route
            path="profile"
            element={<AdminProfile />}
          />

          {/* ORDERS */}

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          {/* PRODUCTS */}

          <Route
            path="products"
            element={<ProductList />}
          />

          {/* ADD PRODUCT */}

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          {/* EDIT PRODUCT */}

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          {/* MEMBERS */}

          <Route
            path="members"
            element={<Members />}
          />

          {/* EDIT MEMBER */}

          <Route
            path="members/:id"
            element={<EditMember />}
          />

          {/* REFERRAL TREE */}

          <Route
            path="referral-tree"
            element={<ReferralTreePage />}
          />

          {/* REPORTS */}

          <Route
            path="reports"
            element={<Reports />}
          />

          {/* UNKNOWN ADMIN PAGE */}

          <Route
            path="*"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          MANAGER AREA
          BLUE SIDEBAR
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["MANAGER"]}
          />
        }
      >

        <Route
          path="/manager"
          element={<ManagerLayout />}
        >

          {/* Redirect the manager area root to its canonical dashboard URL. */}

          <Route
            index
            element={
              <Navigate
                to="/manager/dashboard"
                replace
              />
            }
          />


          {/* =================================================
              MANAGER DASHBOARD

              /manager/dashboard
          ================================================= */}

          <Route
            path="dashboard"
            element={<ManagerDashboard />}
          />

          {/* =================================================
              MANAGER MEMBERS

              /manager/members
          ================================================= */}

          <Route
            path="members"
            element={<ManagerMembers />}
          />

          {/* =================================================
              MANAGER MEMBER DETAILS

              /manager/members/:id/details
          ================================================= */}

          <Route
            path="members/:id/details"
            element={<ManagerMemberDetails />}
          />

          {/* =================================================
              MANAGER ORDERS

              /manager/orders
          ================================================= */}

          <Route
            path="orders"
            element={<ManagerOrders />}
          />

          {/* =================================================
              MANAGER PRODUCTS

              /manager/products
          ================================================= */}

          <Route
            path="products"
            element={<ManagerProducts />}
          />

          {/* =================================================
              MANAGER COMMISSIONS

              /manager/commissions
          ================================================= */}

          <Route
            path="commissions"
            element={<Commissions />}
          />

          {/* =================================================
              MANAGER PROFILE

              /manager/profile
          ================================================= */}

          <Route
            path="profile"
            element={<ManagerProfile />}
          />

          {/* =================================================
              MANAGER REFERRAL TREE

              /manager/referral-tree
          ================================================= */}

          <Route
            path="referral-tree"
            element={<ManagerReferralTreePage />}
          />

          {/* =================================================
              UNKNOWN MANAGER PAGE

              Send back to the manager dashboard.
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/manager/dashboard"
                replace
              />
            }
          />

        </Route>

      </Route>

      {/* =====================================================
          GLOBAL 404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};


export default AppRoutes;
