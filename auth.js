const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "QkbpxH";

let clients = []; 

router.post("/auth", (req, res) => {
  const { email, clientID, clientSecret } = req.body;

  const client = clients.find(
    c =>
      c.email === email &&
      c.clientID === clientID &&
      c.clientSecret === clientSecret
  );

  if (!client) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email, clientID },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;