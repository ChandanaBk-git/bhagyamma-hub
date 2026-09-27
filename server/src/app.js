const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const notFound = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const productRoutes = require("./routes/product.routes");

const app = express();

/* =========================================================
   CORS / SECURITY
========================================================= */

const allowedOrigins = [
    "http://localhost:5173",
    "https://bhagyamma-hub-sigma.vercel.app",
];

/*
  Add CLIENT_URL values from Render environment variables
  if they exist.
*/
if (process.env.CLIENT_URL) {
    const envOrigins = process.env.CLIENT_URL
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    allowedOrigins.push(...envOrigins);
}

/*
  Remove duplicate origins
*/
const uniqueOrigins = [
    ...new Set(allowedOrigins),
];

const corsOptions = {
    origin: (origin, callback) => {

        /*
          Allow requests without an Origin header.
          Example: direct browser/API requests,
          server-to-server requests, Postman, etc.
        */
        if (!origin) {
            return callback(null, true);
        }

        /*
          Allow explicitly configured origins
        */
        if (uniqueOrigins.includes(origin)) {
            return callback(null, true);
        }

        /*
          Allow Vercel deployment and preview URLs
          Example:
          https://bhagyamma-hub-xxxx.vercel.app
        */
        if (
            /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(
                origin
            )
        ) {
            return callback(null, true);
        }

        console.warn(
            "CORS blocked origin:",
            origin
        );

        return callback(
            new Error(
                `CORS blocked origin: ${origin}`
            )
        );
    },

    credentials: true,
};

app.use(cors(corsOptions));

/* =========================================================
   HELMET
========================================================= */

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

/* =========================================================
   BODY PARSERS
========================================================= */

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

/* =========================================================
   PRODUCT ROUTES
========================================================= */

app.use(
    "/api/products",
    productRoutes
);

/* =========================================================
   PERFORMANCE
========================================================= */

app.use(compression());

/* =========================================================
   LOGGING
========================================================= */

app.use(morgan("dev"));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhagyamma Hub API Running",
        version: "v1",
    });
});

/* =========================================================
   STATIC UPLOADS
========================================================= */

app.use(
    "/uploads",
    express.static(
        path.join(
            process.cwd(),
            "uploads"
        )
    )
);

/* =========================================================
   HEALTH
========================================================= */

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString(),
    });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(
    "/api/v1",
    routes
);

/* =========================================================
   404
========================================================= */

app.use(notFound);

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(errorMiddleware);

module.exports = app;