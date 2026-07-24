const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, Server!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});