const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const kycRoutes = require("./routes/kyc.routes");
const path = require("path");

const routes = require("./routes");

const notFound = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const managerRoutes = require("./routes/manager.routes");

const app = express();

/* ===========================================================
   Security Middleware
=========================================================== */

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

/* ===========================================================
   Body Parser
=========================================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use("/api/v1/kyc", kycRoutes);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

/* ===========================================================
   Compression & Logging
=========================================================== */

app.use(compression());

app.use(morgan("dev"));

/* ===========================================================
   Static Files
=========================================================== */

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

/* ===========================================================
   Health Check
=========================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bhagyamma Hub API Running",
    version: "v1",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

/* ===========================================================
   Manager Routes
=========================================================== */

app.use(
  "/api/v1/manager",
  managerRoutes
);

/* ===========================================================
   Main API Routes
=========================================================== */

app.use(
  "/api/v1",
  routes
);

/* ===========================================================
   Error Handling
=========================================================== */

app.use(notFound);

app.use(errorMiddleware);

module.exports = app;