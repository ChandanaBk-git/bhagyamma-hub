
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import MemberLayout from "../layouts/MemberLayout";
import PackagingLayout from "../layouts/PackagingLayout";

// =====================================================
// PACKAGING TEAM
// =====================================================

import PackagingStaff from "../pages/Admin/PackagingStaff";
import PackagingProtectedRoute from "../components/packaging/PackagingProtectedRoute";
import PackagingDashboard from "../pages/Packaging/Dashboard";
import PackagingOrders from "../pages/Packaging/Orders";
import PackagingOrderDetails from "../pages/Packaging/OrderDetails";
import PackagingProfile from "../pages/Packaging/Profile";

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
// MEMBERSHIP PAYMENT
// =====================================================

import MembershipPaymentScanner
  from "../pages/Auth/MembershipPaymentScanner";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword";

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
import Categories from "../pages/Admin/Categories";

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
import ManagerWallet from "../pages/manager/ManagerWallet";

// =====================================================
// MANAGER PACKAGING TEAMS
// =====================================================

import ManagerPackagingTeams
  from "../pages/manager/ManagerPackagingTeams";

import ManagerPackagingTeamOrders
  from "../pages/manager/ManagerPackagingTeamOrders";

// =====================================================
// NOTIFICATIONS
// =====================================================

import Notifications from "../pages/Notifications";

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

  if (role === "MEMBER") {
    return <MemberLayout />;
  }

  if (role === "MANAGER") {
    return <ManagerLayout />;
  }

  if (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  ) {
    return <AdminLayout />;
  }

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

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* PUBLIC NOTIFICATION PAGE */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Route>

      {/* =================================================
          NORMAL PRODUCT ORDER PAYMENT
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
          MEMBERSHIP PAYMENT
      ================================================= */}

      <Route
        path="/membership-payment"
        element={<MembershipPaymentScanner />}
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

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* =================================================
          PACKAGING LOGIN REDIRECT
      ================================================= */}

      <Route
        path="/packaging/login"
        element={
          <Navigate to="/login" replace />
        }
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

          <Route
            index
            element={<MemberDashboard />}
          />

          <Route
            path="dashboard"
            element={<MemberDashboard />}
          />

          <Route
            path="profile"
            element={<MemberProfile />}
          />

          <Route
            path="network"
            element={<MemberNetwork />}
          />

          <Route
            path="products"
            element={<MemberProducts />}
          />

          <Route
            path="orders"
            element={<MemberOrders />}
          />

          <Route
            path="commission"
            element={<MemberCommission />}
          />

          <Route
            path="selling-points"
            element={<MemberSellingPoints />}
          />

          <Route
            path="wallet"
            element={<MemberWallet />}
          />

          <Route
            path="withdraw"
            element={<MemberWithdraw />}
          />

          <Route
            path="welcome-kit"
            element={<MemberWelcomeKit />}
          />

          <Route
            path="reports"
            element={<MemberReports />}
          />

          <Route
            path="settings"
            element={<MemberSettings />}
          />

          <Route
            path="cart"
            element={<Cart />}
          />

          <Route
            path="checkout"
            element={<Checkout />}
          />

          {/* MEMBER NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="*"
            element={
              <Navigate to="/member" replace />
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

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="profile"
            element={<AdminProfile />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />
<Route
  path="categories"
  element={<Categories />}
/>
          <Route
            path="products"
            element={<ProductList />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="members"
            element={<Members />}
          />

          <Route
            path="members/:id"
            element={<EditMember />}
          />

          <Route
            path="referral-tree"
            element={<ReferralTreePage />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="packaging-staff"
            element={<PackagingStaff />}
          />

          {/* ADMIN NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="*"
            element={
              <Navigate to="/admin" replace />
            }
          />

        </Route>

      </Route>

      {/* =================================================
          PACKAGING TEAM AREA
      ================================================= */}

      <Route
        element={<PackagingProtectedRoute />}
      >

        <Route
          path="/packaging"
          element={<PackagingLayout />}
        >

          <Route
            index
            element={
              <Navigate
                to="/packaging/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<PackagingDashboard />}
          />

          <Route
            path="orders"
            element={<PackagingOrders />}
          />

          <Route
            path="orders/:id"
            element={<PackagingOrderDetails />}
          />

          <Route
            path="profile"
            element={<PackagingProfile />}
          />

          {/* PACKAGING NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/packaging/dashboard"
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

          <Route
            index
            element={
              <Navigate
                to="/manager/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<ManagerDashboard />}
          />

          <Route
            path="wallet"
            element={<ManagerWallet />}
          />

          <Route
            path="members"
            element={<ManagerMembers />}
          />

          <Route
            path="members/:id/details"
            element={<ManagerMemberDetails />}
          />

          <Route
            path="orders"
            element={<ManagerOrders />}
          />

          <Route
            path="products"
            element={<ManagerProducts />}
          />

          <Route
            path="selling-points"
            element={<ManagerSellingPoints />}
          />

          <Route
            path="commissions"
            element={<Commissions />}
          />

          <Route
            path="profile"
            element={<ManagerProfile />}
          />

          <Route
            path="referral-tree"
            element={<ManagerReferralTreePage />}
          />

          <Route
            path="packaging-teams"
            element={<ManagerPackagingTeams />}
          />

          <Route
            path="packaging-teams/:teamId/orders"
            element={<ManagerPackagingTeamOrders />}
          />

          {/* MANAGER NOTIFICATIONS */}

          <Route
            path="notifications"
            element={<Notifications />}
          />

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