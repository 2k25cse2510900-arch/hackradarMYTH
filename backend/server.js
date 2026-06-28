const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");
const logger = require("./src/utils/logger");

async function startServer() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      logger.info(`HackRadar backend running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
