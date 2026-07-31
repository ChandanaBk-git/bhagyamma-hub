const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const routes = require("./routes");
const notFound = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const productRoutes = require("./routes/product.routes");
const app = express();
const managerRoutes = require("./routes/manager.routes");


/* ------------------------- Security Middleware ------------------------- */

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

/* -------------------------- Body Parsers -------------------------- */

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

app.use(
    "/api/v1/manager",
    managerRoutes
);

/* ------------------------- Performance ------------------------- */

app.use(compression());

/* ---------------------------- Logging ---------------------------- */

app.use(morgan("dev"));

/* --------------------------- Health Check --------------------------- */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhagyamma Hub API Running",
        version: "v1",
    });
});

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString(),
    });
});

/* ---------------------------- API Routes ---------------------------- */

app.use("/api/v1", routes);

/* ------------------------- Error Handling ------------------------- */

app.use(notFound);

app.use(errorMiddleware);

module.exports = app;