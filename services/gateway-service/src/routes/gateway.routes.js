const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();
const querystring = require("querystring");

function handleProxyReq(proxyReq, req, res, options) {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  let contentType = req.header("Content-Type");
  let bodyData;

  if (contentType.includes("application/json")) {
    bodyData = JSON.stringify(req.body);
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    bodyData = querystring.stringify(req.body);
  } else {
    bodyData = req.body;
  }

  if (bodyData) {
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
}

// Setup proxy middleware
router.use(
  "/auth",
  createProxyMiddleware({
    // target: "https://ps-auth-service.onrender.com",
    target: "http://auth:8001",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
    onProxyReq: handleProxyReq,
  })
);

router.use(
  "/forum",
  createProxyMiddleware({
    // target: "https://ps-forums-service.onrender.com",
    target: "http://forums:8012",
    changeOrigin: true,
    pathRewrite: {
      "^/api/forum": "", // Rewrite the path
    },
    onProxyReq: handleProxyReq,
  })
);

router.use(
  "/post",
  createProxyMiddleware({
    // target: "https://ps-post-service.onrender.com",
    target: "http://post:8014",
    changeOrigin: true,
    pathRewrite: {
      "^/api/post": "", // Rewrite the path
    },
    onProxyReq: handleProxyReq,
  })
);

module.exports = router;
