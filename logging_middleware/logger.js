const axios = require("axios");
const {
  STACKS,
  LEVELS,
  BACKEND_PACKAGES
} = require("./constants");

const LOG_API = process.env.LOG_API || "http://localhost:5001/logs";

const AUTH_TOKEN = process.env.AUTH_TOKEN || ""; 

const Log = async (stack, level, pkg, message) => {
  try {
    if (!STACKS.includes(stack)) {
      throw new Error("Invalid stack");
    }

    if (!LEVELS.includes(level)) {
      throw new Error("Invalid level");
    }

    if (stack === "backend" && !BACKEND_PACKAGES.includes(pkg)) {
      throw new Error("Invalid backend package");
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message
    };

    await axios.post(LOG_API, payload, {
      headers: {
        "Content-Type": "application/json",
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {})
      }
    });

  } catch (err) {
    console.error("Logging Failed:", err.message);
  }
};

module.exports = Log;

