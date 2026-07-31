const ApiResponse = require("../utils/ApiResponse");

const errorMiddleware = (err, req, res, next) => {
    console.error("======== ERROR ========");
    console.error(err);
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
        data: null,
    });
};

module.exports = errorMiddleware;