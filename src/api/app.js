const cors = require("cors");
const express = require("express");
const probe = require("kube-probe");
const config = require("./config");

const routerExternal = express.Router()
routerExternal.use(
  cors({
    origin: config.corsOrigins,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

routerExternal.get("/", (_req, res) => {
  console.log("Get /");
  res.json({
    message: `Hello World! Commit: ${process.env.COMMIT_SHA}, ENVIRONMENT_CLASS: ${process.env.ENVIRONMENT_CLASS}, ENVIRONMENT_NAME: ${process.env.ENVIRONMENT_NAME}`,
  });
});

routerExternal.get("/a-path", (req, res) => {
  console.log("Get /a-path");
  res.json({ message: "Hello from a path!", query: req.query });
});

const mainApi = express();
mainApi.use(config.apiPrefix, routerExternal);

const routerInternal = express.Router()
routerInternal.get("/", (_req, res) => {
  console.log("Get /");
  res.json({
    message: `Hello secret internal World! Commit: ${process.env.COMMIT_SHA}, VERSION: ${process.env.VERSION}, SERVICE_NAME: ${process.env.SERVICE_NAME}, SYSTEM_NAME: ${process.env.SYSTEM_NAME}`,
  });
});

const internalApi = express();
internalApi.use(config.internalPrefix, routerInternal);

// In reality, you would probably have your liveness and readiness probes
// returning 200 only when the application is actually ready (e.g. connectivity to DB)
const probeApi = express();
probe(probeApi, {
  livenessURL: "/health/live",
  readinessURL: "/health/ready",
});

module.exports = {
  mainApi,
  internalApi,
  probeApi,
};
