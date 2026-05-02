const express = require("express");
const router = express.Router();
const axios = require("axios");

const runScheduler = require("./scheduler");
const Log = require("../logging_middleware/logger");

const BASE_URL = "http://20.207.122.201/evaluation-service";


const getHeaders = () => ({
  Authorization: `Bearer ${process.env.AUTH_TOKEN}`
});

router.get("/schedule", async (req, res) => {
  try {

    const result = await runScheduler();

    res.json({
      success: true,
      data: result
    });
  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


router.get("/depots", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/depots`, {
      headers: getHeaders()
    });

    res.json({
      success: true,
      data: response.data.depots
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});


router.get("/vehicles", async (req, res) => {
  try {
    const { depotId } = req.query;

    if (!depotId) {
      return res.status(400).json({
        success: false,
        error: "depotId is required"
      });
    }

    const response = await axios.get(
      `${BASE_URL}/vehicles?depotId=${depotId}`,
      {
        headers: getHeaders()
      }
    );

    const vehicles = response.data.vehicles.map(t => ({
      TaskID: t.TaskID,
      Duration: t.Duration,
      Impact: t.Impact
    }));

    res.json({
      success: true,
      data: vehicles
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

router.post("/logs", (req, res) => {
  console.log("LOG:", req.body);

  res.status(200).json({
    success: true,
    message: "Log received"
  });
});

module.exports = router;