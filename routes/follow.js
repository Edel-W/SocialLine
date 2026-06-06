const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { validateFollowToggle, validateGetFollows } = require("../middleware/follow");
const { toggleFollow, getFollowers, getFollowing } = require("../controllers/follow");

router.post("/:id", authenticateToken, validateFollowToggle, toggleFollow);

router.get("/:id/followers", validateGetFollows, getFollowers);
router.get("/:id/following", validateGetFollows, getFollowing);

module.exports = router;