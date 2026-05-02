require("dotenv").config();

const express = require("express");
const app = express();

const schedulerRoutes = require("./vehicle_maintence_scheduler/routes");
const requestLogger = require("./logging_middleware/middleware");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

let clients = [];

const SECRET_KEY = "QkbpxH";

app.post("/register", (req, res) => {
  const { email, name, rollNo } = req.body;

  const clientID = uuidv4();
  const clientSecret = uuidv4();

  clients.push({
    email,
    name,
    rollNo,
    clientID,
    clientSecret
  });

  res.json({ clientID, clientSecret });
});

app.post("/auth", (req, res) => {
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

const Log = require("./logging_middleware/logger");

app.get("/error", async (req, res) => {
  try {
    throw new Error("Something broke");
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).send("Error occurred");
  }
});


app.use("/", schedulerRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});



// {
//   "email": "saianish_govindu@gmail.com",
//   "name": "Govindu Sai Anish",
//   "mobileNo":"7386010343",
//   "githubUsername":"Anish-0411",
//   "rollNo": "AP23110011600",
//   "accessCode":"QkbpxH"
// }



////////EVALUATION SERVER///////
// {"email":"saianish_govindu@gmail.com","name":"govindu sai anish","rollNo":"ap23110011600","accessCode":"QkbpxH","clientID":"58fa916e-34b9-43c2-acf6-9480017831a8","clientSecret":"nuPcMEZbGqFWdTtv"}%  

// {"token_type":"Bearer","access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYWlhbmlzaF9nb3ZpbmR1QGdtYWlsLmNvbSIsImV4cCI6MTc3NzcwNTE4OCwiaWF0IjoxNzc3NzA0Mjg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDdiYmM1YTEtNGMzNy00ODAwLWIwYTgtYTU3ODc0OTZlYzU0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ292aW5kdSBzYWkgYW5pc2giLCJzdWIiOiI1OGZhOTE2ZS0zNGI5LTQzYzItYWNmNi05NDgwMDE3ODMxYTgifSwiZW1haWwiOiJzYWlhbmlzaF9nb3ZpbmR1QGdtYWlsLmNvbSIsIm5hbWUiOiJnb3ZpbmR1IHNhaSBhbmlzaCIsInJvbGxObyI6ImFwMjMxMTAwMTE2MDAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI1OGZhOTE2ZS0zNGI5LTQzYzItYWNmNi05NDgwMDE3ODMxYTgiLCJjbGllbnRTZWNyZXQiOiJudVBjTUVaYkdxRldkVHR2In0.4gzFgxKxQnvV1od3ySKiZ3LkwNIQR-zEfkG9BPlhAkg","expires_in":1777705188}% 