require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const {
  startNotificationSync,
  stopNotificationSync,
} = require("./services/notificationSync.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB connected successfully");

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Bhagyamma Hub Server running on http://localhost:${PORT}`
      );
    });

    // Start notification polling after database connection
    startNotificationSync();

    const shutdown = () => {
      console.log("Shutting down Bhagyamma Hub...");

      stopNotificationSync();

      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    process.exit(1);
  }
};

startServer();