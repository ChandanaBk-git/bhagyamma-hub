import { Routes, Route } from "react-router-dom";

// ================= Layouts =================
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import MemberLayout from "../layouts/MemberLayout";

// ================= Public Pages =================
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";

// ================= Product =================
import ProductDetails from "../components/products/ProductDetails";

// ================= Payment =================
import PaymentScanner from "../pages/Payment/PaymentScanner";

// ================= Auth =================
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";

// ================= Member =================
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

// ================= Admin =================
import Dashboard from "../pages/Admin/Dashboard";
import ProductList from "../pages/Admin/ProductList";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";
import Members from "../pages/Admin/Members";
import EditMember from "../pages/Admin/EditMember";
import Reports from "../pages/Admin/Reports";
import ReferralTreePage from "../pages/Admin/ReferralTreePage";
import AdminOrders from "../pages/Admin/Orders";

// ================= Manager =================
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerMembers from "../pages/manager/Members";
import ManagerProfile from "../pages/manager/Profile";
import ManagerReferralTreePage from "../pages/manager/ReferralTreePage";
import ManagerOrders from "../pages/manager/Orders";

// ================= Error =================
import NotFound from "../pages/NotFound/NotFound";

// ================= PhonePe =================
import PhonePeCallback from "../pages/Checkout/PhonePeCallback";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}

      <Route element={<MainLayout />}>

        {/* Public Home */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
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

        <Route
          path="/contact"
          element={<Contact />}
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
          PAYMENT
      ===================================================== */}

      <Route
        path="/payment/scan"
        element={<PaymentScanner />}
      />

      <Route
        path="/payment/phonepe/callback"
        element={<PhonePeCallback />}
      />


      {/* =====================================================
          MEMBER AREA

          IMPORTANT:
          Everything inside this Route uses MemberLayout.

          Therefore:
          GREEN SIDEBAR + MEMBER TOPBAR remain visible
          while the content changes.
      ===================================================== */}

      <Route
        path="/member"
        element={<MemberLayout />}
      >

        {/* -------------------------------------------------
            MEMBER DEFAULT
            /member
            ------------------------------------------------- */}

        <Route
          index
          element={<MemberDashboard />}
        />


        {/* -------------------------------------------------
            MEMBER HOME
            /member/home

            Same Home page content as public website,
            but MemberLayout remains around it.
            ------------------------------------------------- */}

        <Route
          path="home"
          element={<Home />}
        />


        {/* -------------------------------------------------
            MEMBER DASHBOARD
            /member/dashboard
            ------------------------------------------------- */}

        <Route
          path="dashboard"
          element={<MemberDashboard />}
        />


        {/* -------------------------------------------------
            MEMBER PROFILE
            /member/profile
            ------------------------------------------------- */}

        <Route
          path="profile"
          element={<MemberProfile />}
        />


        {/* -------------------------------------------------
            MEMBER NETWORK
            /member/network
            ------------------------------------------------- */}

        <Route
          path="network"
          element={<MemberNetwork />}
        />


        {/* -------------------------------------------------
            MEMBER PRODUCTS
            /member/products
            ------------------------------------------------- */}

        <Route
          path="products"
          element={<MemberProducts />}
        />


        {/* -------------------------------------------------
            MEMBER ORDERS
            /member/orders
            ------------------------------------------------- */}

        <Route
          path="orders"
          element={<MemberOrders />}
        />


        {/* -------------------------------------------------
            MEMBER COMMISSION
            /member/commission
            ------------------------------------------------- */}

        <Route
          path="commission"
          element={<MemberCommission />}
        />


        {/* -------------------------------------------------
            MEMBER SELLING POINTS
            /member/selling-points
            ------------------------------------------------- */}

        <Route
          path="selling-points"
          element={<MemberSellingPoints />}
        />


        {/* -------------------------------------------------
            MEMBER WALLET
            /member/wallet
            ------------------------------------------------- */}

        <Route
          path="wallet"
          element={<MemberWallet />}
        />


        {/* -------------------------------------------------
            MEMBER WITHDRAW
            /member/withdraw
            ------------------------------------------------- */}

        <Route
          path="withdraw"
          element={<MemberWithdraw />}
        />


        {/* -------------------------------------------------
            MEMBER WELCOME KIT
            /member/welcome-kit
            ------------------------------------------------- */}

        <Route
          path="welcome-kit"
          element={<MemberWelcomeKit />}
        />


        {/* -------------------------------------------------
            MEMBER REPORTS
            /member/reports
            ------------------------------------------------- */}

        <Route
          path="reports"
          element={<MemberReports />}
        />


        {/* -------------------------------------------------
            MEMBER SETTINGS
            /member/settings
            ------------------------------------------------- */}

        <Route
          path="settings"
          element={<MemberSettings />}
        />


        {/* -------------------------------------------------
            MEMBER CART
            /member/cart
            ------------------------------------------------- */}

        <Route
          path="cart"
          element={<Cart />}
        />


        {/* -------------------------------------------------
            MEMBER CHECKOUT
            /member/checkout
            ------------------------------------------------- */}

        <Route
          path="checkout"
          element={<Checkout />}
        />

      </Route>


      {/* =====================================================
          ADMIN
      ===================================================== */}

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
          path="orders"
          element={<AdminOrders />}
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

      </Route>


      {/* =====================================================
          MANAGER
      ===================================================== */}

      <Route
        path="/manager"
        element={<ManagerLayout />}
      >

        <Route
          index
          element={<ManagerDashboard />}
        />

        <Route
          path="dashboard"
          element={<ManagerDashboard />}
        />

        <Route
          path="members"
          element={<ManagerMembers />}
        />

        <Route
          path="orders"
          element={<ManagerOrders />}
        />

        <Route
          path="profile"
          element={<ManagerProfile />}
        />

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