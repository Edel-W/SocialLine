const express = require("express");
const router = express.Router();
const { validatePost, validatePostUpdate, validatePostDeletion, validateGetPost } = require("../middleware/post");
const authenticateToken = require("../middleware/auth");
const { createPost, updatePost, deletePost, getPost } = require("../controllers/post");

router.get("/:id", validateGetPost, getPost);

router.post("/", authenticateToken, validatePost, createPost); 

router.put("/:id", authenticateToken, validatePostUpdate, updatePost);

router.delete("/:id", authenticateToken, validatePostDeletion, deletePost);

module.exports = router;