const express = require("express");
const cors = require("cors");
const routes = require("./routes/gateway.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }));

// API Gateway routes
app.use("/api", routes);

module.exports = app;
