const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { validateComment, validateCommentDeletion, validateCommentUpdate , validateGetComment } = require("../middleware/comments");
const { createComment, deleteComment, updateComment, getComment } = require("../controllers/comments");


router.get("/single/:id" , validateGetComment, getComment );

router.post("/:postId", authenticateToken, validateComment, createComment );

router.delete("/:id", authenticateToken, validateCommentDeletion, deleteComment);

router.put("/:id", authenticateToken, validateCommentUpdate, updateComment);

module.exports = router;