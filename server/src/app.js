const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");

const kycRoutes = require("./routes/kyc.routes");
const managerRoutes = require("./routes/manager.routes");

const notFound = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();


/*
=========================================================
SECURITY
=========================================================
*/

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://bhagyamma-hub-sigma.vercel.app",
        ],
        credentials: true,
    })
);


app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);


/*
=========================================================
BODY PARSERS
=========================================================
*/

app.use(
    express.json({
        limit: "10mb",
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);


app.use(cookieParser());


/*
=========================================================
COMPRESSION + LOGGER
=========================================================
*/

app.use(compression());

app.use(morgan("dev"));


/*
=========================================================
STATIC FILES
=========================================================
*/

app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);


/*
=========================================================
HEALTH
=========================================================
*/

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Bhagyamma Hub API Running",
            version: "v1",
        });
    }
);


app.get(
    "/health",
    (req, res) => {
        res.status(200).json({
            success: true,
            status: "UP",
            timestamp: new Date().toISOString(),
        });
    }
);


/*
=========================================================
KYC ROUTES
=========================================================
*/

app.use(
    "/api/v1/kyc",
    kycRoutes
);


/*
=========================================================
MANAGER ROUTES

IMPORTANT

Frontend:

/manager/commissions

API:

/api/v1/manager/commissions

=========================================================
*/

app.use(
    "/api/v1/manager",
    managerRoutes
);


/*
=========================================================
MAIN API ROUTES
=========================================================
*/

app.use(
    "/api/v1",
    routes
);


/*
=========================================================
MANAGER MOUNT TEST
=========================================================
*/

app.get(
    "/api/v1/manager-test",
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Manager router mount exists",
        });
    }
);


/*
=========================================================
404
=========================================================
*/

app.use(notFound);


/*
=========================================================
GLOBAL ERROR
=========================================================
*/

app.use(errorMiddleware);


module.exports = app;