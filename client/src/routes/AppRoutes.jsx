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

// ADMIN ORDERS
import AdminOrders from "../pages/Admin/Orders";

// ================= Manager =================
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerMembers from "../pages/manager/Members";
import ManagerProfile from "../pages/manager/Profile";
import ManagerReferralTreePage from "../pages/manager/ReferralTreePage";

// ⭐ MANAGER ORDERS
import ManagerOrders from "../pages/manager/Orders";

// ================= Error =================
import NotFound from "../pages/NotFound/NotFound";

// ================= PhonePe =================
import PhonePeCallback from "../pages/Checkout/PhonePeCallback";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC
      ===================================================== */}

      <Route element={<MainLayout />}>

        <Route
          index
          element={<Home />}
        />

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
          PAYMENT SCANNER
      ===================================================== */}

      <Route
        path="/payment/scan"
        element={<PaymentScanner />}
      />


      {/* =====================================================
          PHONEPE CALLBACK
      ===================================================== */}

      <Route
        path="/payment/phonepe/callback"
        element={<PhonePeCallback />}
      />


      {/* =====================================================
          MEMBER
      ===================================================== */}

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

        {/* ADMIN ORDERS */}

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

        {/* MANAGER HOME */}

        <Route
          index
          element={<ManagerDashboard />}
        />

        {/* MANAGER DASHBOARD */}

        <Route
          path="dashboard"
          element={<ManagerDashboard />}
        />

        {/* MANAGER MEMBERS */}

        <Route
          path="members"
          element={<ManagerMembers />}
        />

        {/* ⭐ MANAGER ORDERS */}

        <Route
          path="orders"
          element={<ManagerOrders />}
        />

        {/* MANAGER PROFILE */}

        <Route
          path="profile"
          element={<ManagerProfile />}
        />

        {/* MANAGER REFERRAL TREE */}

        <Route
          path="referral-tree"
          element={
            <ManagerReferralTreePage />
          }
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