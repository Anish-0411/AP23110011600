const axios = require("axios");
const optimizeTasks = require("./knapsack");
const Log = require("../logging_middleware/logger");

const BASE_URL=null;


const AUTH_TOKEN = process.env.AUTH_TOKEN || "";

const headers = {
  "Content-Type": "application/json",
  ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {})
};

const runScheduler = async () => {
  try {

    const depots = [
        { ID: 1, MechanicHours: 5 },
        { ID: 2, MechanicHours: 6 },
        { ID: 3, MechanicHours: 3 },
        { ID: 4, MechanicHours: 2 },
        { ID: 5, MechanicHours: 8 }
        ];

        const tasks = [
        { duration: 2, score: 10 },
        { duration: 3, score: 15 }
        ];

    const results = [];

    for (const depot of depots) {
      const depotId = depot.ID;
      const maxHours = depot.MechanicHours;

      const maxScore = optimizeTasks(tasks, maxHours);

      results.push({
        depotId,
        maxHours,
        maxScore
      });
    }

    return results;

  } catch (err) {
    throw err;
  }
};

module.exports = runScheduler;


