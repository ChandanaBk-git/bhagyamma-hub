const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/*
=========================================================
AUTHENTICATION MIDDLEWARE
=========================================================
Verifies JWT and attaches the authenticated user to req.user.
=========================================================
*/

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return next(
            new ApiError(
                401,
                "Authentication required"
            )
        );
    }

    const token = authHeader
        .split(" ")[1];

    if (!token) {
        return next(
            new ApiError(
                401,
                "Authentication token missing"
            )
        );
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        /*
        Expected JWT payload:

        {
            id,
            userId,
            role
        }
        */

        if (!decoded?.id) {
            return next(
                new ApiError(
                    401,
                    "Invalid authentication token"
                )
            );
        }

        req.user = {
            id: decoded.id,
            userId: decoded.userId,
            role: decoded.role,
        };

        next();

    } catch (error) {

        return next(
            new ApiError(
                401,
                "Invalid or expired token"
            )
        );
    }
};


/*
=========================================================
ROLE AUTHORIZATION
=========================================================
Usage:

authorize("MANAGER")

or

authorize("SUPER_ADMIN")
=========================================================
*/

const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return next(
                new ApiError(
                    401,
                    "Authentication required"
                )
            );
        }

        if (!req.user.role) {
            return next(
                new ApiError(
                    403,
                    "User role not found"
                )
            );
        }

        if (
            !roles.includes(
                req.user.role
            )
        ) {
            return next(
                new ApiError(
                    403,
                    "Access denied"
                )
            );
        }

        next();
    };
};


module.exports = {
    protect,
    authorize,
};