import React from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

const PackagingProtectedRoute = () => {
    const location = useLocation();

    const token =
        localStorage.getItem(
            "packagingToken"
        );

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem(
                "packagingUser"
            ) || "null"
        );
    } catch (error) {
        user = null;
    }

    const role = String(
        user?.role || ""
    ).toUpperCase();

    /*
    ================================================
    NO PACKAGING TOKEN
    ================================================
    */

    if (!token) {
        return (
            <Navigate
                to="/packaging/login"
                replace
                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }

    /*
    ================================================
    WRONG ROLE
    ================================================
    */

    if (role !== "PACKAGING") {
        localStorage.removeItem(
            "packagingToken"
        );

        localStorage.removeItem(
            "packagingUser"
        );

        return (
            <Navigate
                to="/packaging/login"
                replace
            />
        );
    }

    /*
    ================================================
    PACKAGING USER AUTHENTICATED
    ================================================
    */

    return <Outlet />;
};

export default PackagingProtectedRoute;