const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { validateFollowToggle, validateGetFollows } = require("../middleware/follow");

const { followUser, unfollowUser, getFollowLists } = require("../controllers/follow");

router.post("/:id", authenticateToken, validateFollowToggle, followUser);

router.delete("/:id", authenticateToken, validateFollowToggle, unfollowUser);

router.get("/:id/lists", validateGetFollows, getFollowLists);

module.exports = router;