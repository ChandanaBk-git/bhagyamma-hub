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

// NORMAL PRODUCT ORDER PAYMENT
import PaymentScanner from "../pages/Payment/PaymentScanner";

// PHONEPE CALLBACK
import PhonePeCallback from "../pages/Checkout/PhonePeCallback";

// =====================================================
// MEMBERSHIP PAYMENT
// =====================================================

// SEPARATE ₹2,000 REGISTRATION PAYMENT
import MembershipPaymentScanner
  from "../pages/Auth/MembershipPaymentScanner";

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
import ManagerSellingPoints from "../pages/manager/SellingPoints";

// =====================================================
// ERROR
// =====================================================

import NotFound from "../pages/NotFound/NotFound";

// =====================================================
// AUTH PROTECTION
// =====================================================

import ProtectedRoute from "../components/auth/ProtectedRoute";


// =====================================================
// ROLE BASED HOME LAYOUT
// =====================================================
//
// IMPORTANT:
//
// Member logged in:
//
//     /
//     ↓
//     RoleBasedHomeLayout
//     ↓
//     MemberLayout
//     ↓
//     Outlet
//     ↓
//     Home
//
// Guest / normal user:
//
//     /
//     ↓
//     RoleBasedHomeLayout
//     ↓
//     MainLayout
//     ↓
//     Outlet
//     ↓
//     Home
//
// This is the correct structure because both
// MemberLayout and MainLayout use <Outlet />.
//

const RoleBasedHomeLayout = () => {

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    user = {};
  }

  const role = String(
    user?.role || ""
  ).toUpperCase();

  // ===================================================
  // MEMBER
  // ===================================================

  if (role === "MEMBER") {
    return <MemberLayout />;
  }

  // ===================================================
  // MANAGER
  // ===================================================

  if (role === "MANAGER") {
    return <ManagerLayout />;
  }

  // ===================================================
  // ADMIN
  // ===================================================

  if (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  ) {
    return <AdminLayout />;
  }

  // ===================================================
  // GUEST / NORMAL USER
  // ===================================================

  return <MainLayout />;
};


// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {

  return (
    <Routes>

      {/* =================================================
          MAIN HOME PAGE

          This is the important fix.

          The layout contains Outlet.
          Home is supplied through the nested route.
      ================================================= */}

      <Route
        path="/"
        element={<RoleBasedHomeLayout />}
      >
        <Route
          index
          element={<Home />}
        />
      </Route>


      {/* =================================================
          PUBLIC WEBSITE
      ================================================= */}

      <Route element={<MainLayout />}>

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

      </Route>


      {/* =================================================
          NORMAL PRODUCT ORDER PAYMENT

          DO NOT USE THIS FOR REGISTRATION.
      ================================================= */}

      <Route
        path="/payment/scan"
        element={<PaymentScanner />}
      />

      <Route
        path="/payment"
        element={<PaymentScanner />}
      />


      {/* =================================================
          PHONEPE CALLBACK
      ================================================= */}

      <Route
        path="/payment/phonepe/callback"
        element={<PhonePeCallback />}
      />


      {/* =================================================
          ₹2,000 MEMBERSHIP REGISTRATION PAYMENT

          COMPLETELY SEPARATE FROM ORDER PAYMENT.

          /membership-payment
              ↓
          ₹2,000
              ↓
          QR CODE
              ↓
          PAY
              ↓
          SCREENSHOT
              ↓
          WHATSAPP
              ↓
          ADMIN VERIFICATION
      ================================================= */}

      <Route
        path="/membership-payment"
        element={
          <MembershipPaymentScanner />
        }
      />


      {/* =================================================
          AUTH
      ================================================= */}

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


      {/* =================================================
          MEMBER AREA
      ================================================= */}

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

          {/* =================================================
              MEMBER DASHBOARD
          ================================================= */}

          <Route
            index
            element={<MemberDashboard />}
          />

          <Route
            path="dashboard"
            element={<MemberDashboard />}
          />


          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="profile"
            element={<MemberProfile />}
          />


          {/* =================================================
              NETWORK
          ================================================= */}

          <Route
            path="network"
            element={<MemberNetwork />}
          />


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <Route
            path="products"
            element={<MemberProducts />}
          />


          {/* =================================================
              ORDERS
          ================================================= */}

          <Route
            path="orders"
            element={<MemberOrders />}
          />


          {/* =================================================
              COMMISSION
          ================================================= */}

          <Route
            path="commission"
            element={<MemberCommission />}
          />


          {/* =================================================
              SELLING POINTS
          ================================================= */}

          <Route
            path="selling-points"
            element={<MemberSellingPoints />}
          />


          {/* =================================================
              WALLET
          ================================================= */}

          <Route
            path="wallet"
            element={<MemberWallet />}
          />


          {/* =================================================
              WITHDRAW
          ================================================= */}

          <Route
            path="withdraw"
            element={<MemberWithdraw />}
          />


          {/* =================================================
              WELCOME KIT
          ================================================= */}

          <Route
            path="welcome-kit"
            element={<MemberWelcomeKit />}
          />


          {/* =================================================
              REPORTS
          ================================================= */}

          <Route
            path="reports"
            element={<MemberReports />}
          />


          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="settings"
            element={<MemberSettings />}
          />


          {/* =================================================
              MEMBER CART
          ================================================= */}

          <Route
            path="cart"
            element={<Cart />}
          />


          {/* =================================================
              MEMBER CHECKOUT
          ================================================= */}

          <Route
            path="checkout"
            element={<Checkout />}
          />


          {/* =================================================
              UNKNOWN MEMBER ROUTE
          ================================================= */}

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


      {/* =================================================
          ADMIN AREA
      ================================================= */}

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

          {/* DASHBOARD */}

          <Route
            index
            element={<Dashboard />}
          />

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


          {/* UNKNOWN ADMIN ROUTE */}

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


      {/* =================================================
          MANAGER AREA
      ================================================= */}

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

          {/* MANAGER ROOT */}

          <Route
            index
            element={
              <Navigate
                to="/manager/dashboard"
                replace
              />
            }
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


          {/* SELLING POINTS */}

          <Route
            path="selling-points"
            element={<ManagerSellingPoints />}
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
            element={
              <ManagerReferralTreePage />
            }
          />


          {/* UNKNOWN MANAGER ROUTE */}

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


      {/* =================================================
          GLOBAL 404
      ================================================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;