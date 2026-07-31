import { Routes, Route } from "react-router-dom";

// ================= Layouts =================
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";

// ================= Public Pages =================
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";

// ================= Auth Pages =================
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";

// ================= Member =================
import MemberDashboard from "../pages/Dashboard/MemberDashboard";

// ================= Admin =================
import Dashboard from "../pages/Admin/Dashboard";
import ProductList from "../pages/Admin/ProductList";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";
import Members from "../pages/Admin/Members";
import Reports from "../pages/Admin/Reports";
import ReferralTreePage from "../pages/Admin/ReferralTreePage";

// ================= Manager =================
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerMembers from "../pages/manager/Members";
import ManagerProfile from "../pages/manager/Profile";
import ManagerReferralTreePage from "../pages/manager/ReferralTreePage";

// ================= Components =================
import EditMember from "../pages/Admin/EditMember";

// ================= Error =================
import NotFound from "../pages/NotFound/NotFound";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ================= AUTH ================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ================= MEMBER ================= */}

      <Route
        path="/dashboard"
        element={<MemberDashboard />}
      />

      {/* ================= ADMIN ================= */}

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

      {/* ================= MANAGER ================= */}

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
          path="referral-tree"
          element={<ManagerReferralTreePage />}
        />

        <Route
          path="profile"
          element={<ManagerProfile />}
        />
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;















