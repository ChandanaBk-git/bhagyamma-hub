import { Routes, Route, Navigate } from "react-router-dom";

import ManagerLayout from "../layouts/ManagerLayout";

import Dashboard from "../pages/manager/Dashboard";
import Members from "../pages/manager/Members";
import Profile from "../pages/manager/Profile";
import Orders from "../pages/manager/Orders";

import ReferralTree from "../components/referral/ReferralTree";


const ManagerRoutes = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={<ManagerLayout />}
      >

        {/* =========================
            MANAGER DASHBOARD
        ========================= */}

        <Route
          path="dashboard"
          element={<Dashboard />}
        />


        {/* =========================
            MANAGER MEMBERS
        ========================= */}

        <Route
          path="members"
          element={<Members />}
        />


        {/* =========================
            MANAGER ORDERS
        ========================= */}

        <Route
          path="orders"
          element={<Orders />}
        />


        {/* =========================
            MANAGER REFERRAL TREE
        ========================= */}

        <Route
          path="referral-tree"
          element={<ReferralTree />}
        />


        {/* =========================
            MANAGER PROFILE
        ========================= */}

        <Route
          path="profile"
          element={<Profile />}
        />


        {/* =========================
            DEFAULT
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

      </Route>

    </Routes>
  );
};


export default ManagerRoutes;