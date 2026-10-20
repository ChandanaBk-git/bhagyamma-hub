
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // 1. Wait until authentication is checked
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  // 2. Require a valid authenticated session
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Normalize roles before comparing
  const userRole = String(user.role || "").trim().toUpperCase();

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).trim().toUpperCase()
  );

  // 4. Block users who do not have the required role
  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    // Redirect to the appropriate dashboard for their role
    switch (userRole) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return <Navigate to="/admin" replace />;

      case "MANAGER":
        return <Navigate to="/manager" replace />;

      case "MEMBER":
        return <Navigate to="/member" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  // 5. Allow authorized users
  return <Outlet />;
};

export default ProtectedRoute;
