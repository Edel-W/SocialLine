const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { validateLikeToggle, validateGetLikes } = require("../middleware/likes");

const { likePost, unlikePost } = require("../controllers/likes");

router.post("/post/:id", authenticateToken, validateLikeToggle, likePost);

router.delete("/post/:id", authenticateToken, validateLikeToggle, unlikePost);

module.exports = router;