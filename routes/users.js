const express = require("express");
const router = express.Router();
const { validateUser, validateLogin, validateDeletion, validateUpdate, validateGetUser } = require("../middleware/user");
const authenticateToken = require("../middleware/auth");
const { registerUser, loginUser, updateUser, deleteUser, getUser } = require("../controllers/user");

router.get("/:id", validateGetUser, getUser);

// Registration Route
router.post("/", validateUser, registerUser);

// Login Route
router.post("/login", validateLogin, loginUser);

router.put("/:id", authenticateToken, validateUpdate, updateUser);

router.delete("/:id", authenticateToken, validateDeletion, deleteUser);

module.exports = router;