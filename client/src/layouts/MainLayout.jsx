import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ManagerLayout from "./ManagerLayout";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const role = String(user?.role || "").toUpperCase();

  // Managers keep their panel chrome while viewing the public Home content.
  if (pathname === "/" && role === "MANAGER") {
    return <ManagerLayout />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
