const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function validateComment(req, res, next) {
    try {
        const { comment_content } = req.body;
        
        const { postId } = req.params; 

        if (!comment_content || comment_content.trim() === "") {
            return res.status(400).json({
                error: "You can't leave a blank comment."
            });
        }
        const postExists = await prisma.posts.findUnique({
            where: { post_id: parseInt(postId) }
        });

        if (!postExists) {
            return res.status(404).json({
                error: "The post you are trying to leave a comment on does not exist!"
            });
        }

        next();
     } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



async function validateCommentDeletion(req, res, next) {
    try {
        const { id } = req.params; 
        const userId = req.user.user_id;

        const comment = await prisma.comments.findUnique({
            where: { comment_id: parseInt(id) }
        });

        if (!comment) {
            return res.status(404).json({
                error: "Comment not found."
            });
        }

    if (comment.user_id !== userId) {
            return res.status(403).json({
                error: "Access denied. You can only delete your own comments."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


async function validateCommentUpdate(req, res, next) {
    try {
        const { id } = req.params;
        const { comment_content } = req.body;
        const userId = req.user.user_id;

        if (!comment_content || comment_content.trim() === "") {
            return res.status(400).json({
                error: "Comment content cannot be blank."
            });
        }

        const comment = await prisma.comments.findUnique({
            where: { comment_id: parseInt(id) }
        });

        if (!comment) {
            return res.status(404).json({
                error: "The comment you are trying to update does not exist!"
            });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({
                error: "Access denied. You can only edit your own comments."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateGetComment (req, res, next) {
    const { id } = req.params;
    
    try {
        const comment = await prisma.comments.findUnique({
            where: { comment_id: parseInt(id)}
        });

        if(!comment) {
            return res.status(404).json({
                error: "The comment you are looking for does not exist!"
            });
        }

        req.comment = comment;
        next();

    } catch(error) {
        return res.status(500).json({ error: error.message});
    }
}

module.exports = {
    validateComment,
    validateCommentDeletion,
    validateCommentUpdate,
    validateGetComment
};