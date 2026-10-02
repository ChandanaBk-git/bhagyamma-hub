
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(
            new ApiError(401, "Authentication required")
        );
    }

    // Extract JWT token
    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(
            new ApiError(401, "Authentication token missing")
        );
    }

    // Verify JWT
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables");

            return next(
                new ApiError(500, "Authentication configuration error")
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Validate token payload
        if (!decoded || !decoded.id) {
            return next(
                new ApiError(401, "Invalid authentication token")
            );
        }

        // Attach authenticated user
        req.user = {
            id: decoded.id,
            userId: decoded.userId || decoded.id,
            packagingStaffId: decoded.packagingStaffId || null,
            loginId: decoded.loginId || null,
            role: decoded.role || null,
        };

        return next();

    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            return next(
                new ApiError(401, "Invalid or expired token")
            );
        }

        console.error("Authentication middleware error:", error);

        return next(error);
    }
};

// =====================================
// ROLE AUTHORIZATION
// =====================================

const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(
                new ApiError(401, "Authentication required")
            );
        }

        if (!req.user.role) {
            return next(
                new ApiError(403, "User role not found")
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(403, "Access denied")
            );
        }

        return next();
    };
};

// =====================================
// EXPORT MIDDLEWARE
// =====================================

module.exports = {
    protect,
    authorize,
};