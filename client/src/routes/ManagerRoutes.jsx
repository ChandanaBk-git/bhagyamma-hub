import { Routes, Route, Navigate } from "react-router-dom";

import ManagerLayout from "../layouts/ManagerLayout";

import Dashboard from "../pages/manager/Dashboard";
import Members from "../pages/manager/Members";
import Profile from "../pages/manager/Profile";

// Reuse existing Referral Tree
import ReferralTree from "../components/referral/ReferralTree";

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/members"
          element={<Members />}
        />

        <Route
          path="/referral-tree"
          element={<ReferralTree />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="*"
          element={<Navigate to="/manager/dashboard" />}
        />

      </Route>
    </Routes>
  );
};

export default ManagerRoutes;