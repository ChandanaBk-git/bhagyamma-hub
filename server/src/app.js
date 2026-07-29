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




/* ------------------------- Security Middleware ------------------------- */

const corsOptions = {
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true,
    credentials: true,
};
app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

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

app.use("/api/products", productRoutes);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

app.use(cookieParser());

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
  express.static(path.join(__dirname, "uploads"))
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