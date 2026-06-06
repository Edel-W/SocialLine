const prisma = require("../prisma"); 

async function validatePost (req, res, next) {
    try {
        const { post_content } = req.body;

        if (!post_content || post_content.trim() === "") {
            return res.status(400).json({
                error: "Post content can't be blank!"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json ({
            error: error.message
        });
    }
}

async function validatePostUpdate(req, res, next) {
    try {
        const { id } = req.params;
        const { post_content } = req.body;
        const userId = req.user.user_id;

        if (!post_content || post_content.trim() === "") {
            return res.status(400).json({
                error: "Post content cannot be blank."
            });
        }

        const post = await prisma.posts.findUnique ({
            where: { post_id: parseInt(id)}
        });

        if(!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({
                error: "Access denied. You can only edit your own post."
            });
        }

        next();
    } catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }

}

async function validatePostDeletion (req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        const post = await prisma.posts.findUnique ({
            where: { post_id: parseInt(id)}
        });

        if(!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({
                error: "Access denied. You can only delete your own post."
            });
        }

        next();
    } catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }

}

async function validateGetPost (req, res, next) {
    const { id } = req.params;
    
    try {
        const post = await prisma.posts.findUnique({
            where: { post_id: parseInt(id)}
        });

        if(!post) {
            return res.status(404).json({
                error: "The post you are looking for does not exist!"
            });
        }

        req.post = post;
        next();

    } catch(error) {
        return res.status(500).json({ error: error.message});
    }
}

module.exports = {
    validatePost,
    validatePostDeletion,
    validatePostUpdate,
    validateGetPost
}
