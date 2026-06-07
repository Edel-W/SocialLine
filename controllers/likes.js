const prisma = require("../prisma");

async function likePost(req, res) {
    const userId = req.user.user_id;
    const { id } = req.params;

    try {
        await prisma.likes.create({
            data: {
                user_id: userId,
                post_id: parseInt(id)
            }
        });
        return res.status(201).json({ message: "Post liked successfully." });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "You have already liked this post." });
        }
        return res.status(500).json({ error: error.message });
    }
}

async function unlikePost(req, res) {
    const userId = req.user.user_id;
    const { id } = req.params;

    try {
        await prisma.likes.delete({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: parseInt(id)
                }
            }
        });
        return res.status(200).json({ message: "Post unliked successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { likePost, unlikePost };