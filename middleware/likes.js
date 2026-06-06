const prisma = require("../prisma"); 

async function validateLikeToggle(req, res, next) {
    try {
        const { id } = req.params; // The post_id being liked

        const postExists = await prisma.posts.findUnique({
            where: { post_id: parseInt(id) }
        });

        if (!postExists) {
            return res.status(404).json({ error: "The post you are trying to like does not exist!" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateGetLikes(req, res, next) {
    try {
        const { id } = req.params;

        const postExists = await prisma.posts.findUnique({
            where: { post_id: parseInt(id) }
        });

        if (!postExists) {
            return res.status(404).json({ error: "Post not found." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { validateLikeToggle, validateGetLikes };