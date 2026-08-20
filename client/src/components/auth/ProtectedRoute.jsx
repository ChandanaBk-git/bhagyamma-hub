import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";


const ProtectedRoute = ({
    allowedRoles = [],
}) => {

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();


    /*
    =====================================================
    AUTH LOADING
    =====================================================
    */

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


    /*
    =====================================================
    NOT AUTHENTICATED
    =====================================================
    */

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    /*
    =====================================================
    ROLE CHECK
    =====================================================
    */

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    /*
    =====================================================
    AUTHORIZED
    =====================================================
    */

    return <Outlet />;
};


export default ProtectedRoute;