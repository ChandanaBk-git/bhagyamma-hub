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


const AppRoutes = () => {

  return (

    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
          
          Public users use MainLayout.
          This is the GREEN/normal public website layout.
      ===================================================== */}

      <Route
        element={
          <MainLayout />
        }
      >

        {/* HOME */}

        <Route
          path="/"
          element={
            <Home />
          }
        />


        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <About />
          }
        />


        {/* PRODUCTS */}

        <Route
          path="/products"
          element={
            <Products />
          }
        />


        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={
            <ProductDetails />
          }
        />


        {/* CART */}

        <Route
          path="/cart"
          element={
            <Cart />
          }
        />


        {/* ORDERS */}

        <Route
          path="/orders"
          element={
            <Orders />
          }
        />


        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />


        {/* CONTACT */}

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />

      </Route>


      {/* =====================================================
          AUTH
      ===================================================== */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      <Route
        path="/register"
        element={
          <Register />
        }
      />


      <Route
        path="/verify-otp"
        element={
          <VerifyOtp />
        }
      />


      {/* =====================================================
          PAYMENT
      ===================================================== */}

      <Route
        path="/payment/scan"
        element={
          <PaymentScanner />
        }
      />


      <Route
        path="/payment/phonepe/callback"
        element={
          <PhonePeCallback />
        }
      />


      {/* =====================================================
          MEMBER AREA
          
          Everything inside /member uses MemberLayout.
          
          Therefore:
          
          /member
          /member/home
          /member/dashboard
          /member/products
          etc.
          
          all keep the GREEN MEMBER SIDEBAR.
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "MEMBER",
            ]}
          />
        }
      >

        <Route
          path="/member"
          element={
            <MemberLayout />
          }
        >

          {/* =================================================
              MEMBER DEFAULT
              
              /member
          ================================================= */}

          <Route
            index
            element={
              <MemberDashboard />
            }
          />


          {/* =================================================
              MEMBER HOME
              
              /member/home
              
              IMPORTANT:
              This is NOT the public "/".
              It stays inside MemberLayout.
          ================================================= */}

          <Route
            path="home"
            element={
              <Home />
            }
          />


          {/* =================================================
              MEMBER DASHBOARD
              
              /member/dashboard
          ================================================= */}

          <Route
            path="dashboard"
            element={
              <MemberDashboard />
            }
          />


          {/* =================================================
              MEMBER PROFILE
          ================================================= */}

          <Route
            path="profile"
            element={
              <MemberProfile />
            }
          />


          {/* =================================================
              MEMBER NETWORK
          ================================================= */}

          <Route
            path="network"
            element={
              <MemberNetwork />
            }
          />


          {/* =================================================
              MEMBER PRODUCTS
          ================================================= */}

          <Route
            path="products"
            element={
              <MemberProducts />
            }
          />


          {/* =================================================
              MEMBER ORDERS
          ================================================= */}

          <Route
            path="orders"
            element={
              <MemberOrders />
            }
          />


          {/* =================================================
              MEMBER COMMISSION
          ================================================= */}

          <Route
            path="commission"
            element={
              <MemberCommission />
            }
          />


          {/* =================================================
              MEMBER SELLING POINTS
          ================================================= */}

          <Route
            path="selling-points"
            element={
              <MemberSellingPoints />
            }
          />


          {/* =================================================
              MEMBER WALLET
          ================================================= */}

          <Route
            path="wallet"
            element={
              <MemberWallet />
            }
          />


          {/* =================================================
              MEMBER WITHDRAW
          ================================================= */}

          <Route
            path="withdraw"
            element={
              <MemberWithdraw />
            }
          />


          {/* =================================================
              MEMBER WELCOME KIT
          ================================================= */}

          <Route
            path="welcome-kit"
            element={
              <MemberWelcomeKit />
            }
          />


          {/* =================================================
              MEMBER REPORTS
          ================================================= */}

          <Route
            path="reports"
            element={
              <MemberReports />
            }
          />


          {/* =================================================
              MEMBER SETTINGS
          ================================================= */}

          <Route
            path="settings"
            element={
              <MemberSettings />
            }
          />


          {/* =================================================
              MEMBER CART
          ================================================= */}

          <Route
            path="cart"
            element={
              <Cart />
            }
          />


          {/* =================================================
              MEMBER CHECKOUT
          ================================================= */}

          <Route
            path="checkout"
            element={
              <Checkout />
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          ADMIN AREA
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
            ]}
          />
        }
      >

        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        >

          {/* =================================================
              ADMIN DEFAULT
          ================================================= */}

          <Route
            index
            element={
              <Dashboard />
            }
          />


          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="dashboard"
            element={
              <Dashboard />
            }
          />


          {/* =================================================
              ADMIN ORDERS
          ================================================= */}

          <Route
            path="orders"
            element={
              <AdminOrders />
            }
          />


          {/* =================================================
              ADMIN PRODUCTS
          ================================================= */}

          <Route
            path="products"
            element={
              <ProductList />
            }
          />


          <Route
            path="products/add"
            element={
              <AddProduct />
            }
          />


          <Route
            path="products/edit/:id"
            element={
              <EditProduct />
            }
          />


          {/* =================================================
              ADMIN MEMBERS
          ================================================= */}

          <Route
            path="members"
            element={
              <Members />
            }
          />


          <Route
            path="members/:id"
            element={
              <EditMember />
            }
          />


          {/* =================================================
              ADMIN REFERRAL TREE
          ================================================= */}

          <Route
            path="referral-tree"
            element={
              <ReferralTreePage />
            }
          />


          {/* =================================================
              ADMIN REPORTS
          ================================================= */}

          <Route
            path="reports"
            element={
              <Reports />
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          MANAGER AREA
          
          IMPORTANT:
          
          EVERYTHING inside /manager uses ManagerLayout.
          
          Therefore the SIDEBAR REMAINS BLUE.
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "MANAGER",
            ]}
          />
        }
      >

        <Route
          path="/manager"
          element={
            <ManagerLayout />
          }
        >

          {/* =================================================
              MANAGER DEFAULT
              
              /manager
              
              Opens Manager Dashboard.
          ================================================= */}

          <Route
            index
            element={
              <ManagerDashboard />
            }
          />


          {/* =================================================
              MANAGER DASHBOARD
              
              /manager/dashboard
          ================================================= */}

          <Route
            path="dashboard"
            element={
              <ManagerDashboard />
            }
          />


          {/* =================================================
              MANAGER HOME
              
              /manager/home
              
              IMPORTANT:
              
              DO NOT navigate the manager to "/".
              
              "/":
                  MainLayout
              
              "/manager/home":
                  ManagerLayout
              
              Therefore this page keeps the BLUE
              manager sidebar.
          ================================================= */}

          <Route
            path="home"
            element={
              <Home />
            }
          />


          {/* =================================================
              MANAGER MEMBERS
              
              /manager/members
          ================================================= */}

          <Route
            path="members"
            element={
              <ManagerMembers />
            }
          />


          {/* =================================================
              MANAGER MEMBER DETAILS
              
              /manager/members/:id/details
          ================================================= */}

          <Route
            path="members/:id/details"
            element={
              <ManagerMemberDetails />
            }
          />


          {/* =================================================
              MANAGER ORDERS
              
              /manager/orders
          ================================================= */}

          <Route
            path="orders"
            element={
              <ManagerOrders />
            }
          />


          {/* =================================================
              MANAGER COMMISSION
              
              /manager/commissions
              
              IMPORTANT:
              This must be RELATIVE.
          ================================================= */}

          <Route
            path="commissions"
            element={
              <Commissions />
            }
          />


          {/* =================================================
              MANAGER PRODUCTS
              
              /manager/products
          ================================================= */}

          <Route
            path="products"
            element={
              <ManagerProducts />
            }
          />


          {/* =================================================
              MANAGER REFERRAL TREE
              
              /manager/referral-tree
          ================================================= */}

          <Route
            path="referral-tree"
            element={
              <ManagerReferralTreePage />
            }
          />


          {/* =================================================
              MANAGER PROFILE
              
              /manager/profile
          ================================================= */}

          <Route
            path="profile"
            element={
              <ManagerProfile />
            }
          />

        </Route>

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>

  );

};


export default AppRoutes;