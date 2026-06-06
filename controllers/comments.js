const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createComment(req, res) {
    const { comment_content } = req.body;

    const { postId } = req.params;
    const userId = req.user.user_id;

    try {
        const comment = await prisma.comments.create({
            data: {
                comment_content: comment_content,
                user_id: userId,
                post_id: parseInt(postId)
            }
        });

        return res.status(201).json({
            message: "Comment created Successfully!",
            comment: {
                comment_id: comment.comment_id,
                comment_content: comment.comment_content,
                user_id: comment.user_id,
                post_id: comment.post_id,
                created_at: comment.created_at
            }
        });

    } catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

async function deleteComment(req, res) {
    
    const { id } = req.params;
    
    try {
        const comment = await prisma.comments.delete({
            where: { comment_id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Comment deleted successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

async function updateComment (req, res) {
    const { id } = req.params;
    const { comment_content } = req.body;

    try{

        const comment = await prisma.comments.update({
            where: { comment_id: parseInt(id) },
            data: {
                comment_content: comment_content
            }
        });

        return res.status(200).json({
            message: "Comment updated successfully!",
            comment: {
                comment_id: comment.comment_id,
                comment_content: comment.comment_content,
                post_id: comment.post_id,
                user_id: comment.user_id
            }
        });

    } catch(error){
        return res.status(500).json({
            error: error.message
        });
    }
}

async function getComment (req, res) {
    try {
           const comment = req.comment;

        return res.status(200).json({
            message: "Comment fetched successfully",
            comment: {
                comment_id: comment.comment_id,
                comment_content: comment.comment_content,
                post_id: comment.post_id,
                user_id: comment.user_id,
                created_at: comment.created_at

            }
        });
        
    } catch(error){
        return res.status(500).json({
            error: error.message
        });
    }

} 


module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getComment
} ;