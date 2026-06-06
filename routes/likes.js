const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { validateLikeToggle, validateGetLikes } = require("../middleware/likes");
const { toggleLike, getPostLikes } = require("../controllers/likes");

router.get("/post/:id", validateGetLikes, getPostLikes);

router.post("/post/:id", authenticateToken, validateLikeToggle, toggleLike);

module.exports = router;