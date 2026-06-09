const express = require("express");
const router = express.Router();
const { validatePost, validatePostUpdate, validatePostDeletion, validateGetPost } = require("../middleware/post");
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createPost, updatePost, deletePost, getPost, getFeed } = require("../controllers/post");

router.get("/feed", authenticateToken, getFeed);

router.get("/:id", validateGetPost, getPost);

router.post("/", authenticateToken, upload.single("image"), validatePost, createPost); 

router.put("/:id", authenticateToken, validatePostUpdate, updatePost);

router.delete("/:id", authenticateToken, validatePostDeletion, deletePost);

module.exports = router;