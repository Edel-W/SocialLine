const prisma = require("../prisma"); 

async function getSystemMetrics(req, res) {
    try {
        const [userCount, postCount, commentCount, likeCount] = await Promise.all([
            prisma.users.count(),
            prisma.posts.count(),
            prisma.comments.count(),
            prisma.likes.count()
        ]);

        return res.status(200).json({
            metrics: {
                total_users: userCount,
                total_posts: postCount,
                total_comments: commentCount,
                total_likes: likeCount
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function forceDeletePost(req, res) {
    const { id } = req.params;
    try {
        await prisma.posts.delete({
            where: { post_id: parseInt(id) }
        });
        return res.status(200).json({ message: "Content removed successfully by administrator override." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function forceDeleteComment(req, res) {
    const { id } = req.params;
    try {
        await prisma.comments.delete({
            where: { comment_id: parseInt(id) }
        });
        return res.status(200).json({ message: "Inappropriate comment purged successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function terminateUserAccount(req, res) {
    const { id } = req.params;
    const targetUserId = parseInt(id);

    try {
        await prisma.$transaction([
            prisma.conversation_participants.deleteMany({
                where: { user_id: targetUserId }
            }),
            prisma.users.delete({
                where: { user_id: targetUserId }
            })
        ]);

        return res.status(200).json({ message: "User account dropped and banned from system cleanly." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getSystemMetrics, forceDeletePost, forceDeleteComment, terminateUserAccount };