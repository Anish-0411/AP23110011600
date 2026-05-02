const Log = require("./logger");

const requestLogger = async (req, res, next) => {
  const start = Date.now();

  try {
    await Log(
      "backend",
      "info",
      "route",
      `Incoming request: ${req.method} ${req.originalUrl}`
    );
  } catch (e) {}

  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      await Log(
        "backend",
        "info",
        "route",
        `Response: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
      );
    } catch (e) {}
  });

  next();
};

module.exports = requestLogger;