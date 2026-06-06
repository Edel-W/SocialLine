const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");
const { getSystemMetrics, forceDeletePost, forceDeleteComment, terminateUserAccount } = require("../controllers/admin");

router.get("/metrics", authenticateToken, requireAdmin, getSystemMetrics);

router.delete("/posts/:id", authenticateToken, requireAdmin, forceDeletePost);

router.delete("/comments/:id", authenticateToken, requireAdmin, forceDeleteComment);

router.delete("/users/:id", authenticateToken, requireAdmin, terminateUserAccount);

module.exports = router;