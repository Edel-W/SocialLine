const prisma = require("../prisma"); 

async function toggleLike(req, res) {
    const { id } = req.params; 
    const userId = req.user.user_id;

    try {
        const existingLike = await prisma.likes.findFirst({
            where: {
                post_id: parseInt(id),
                user_id: userId
            }
        });

        if (existingLike) {
            await prisma.likes.delete({
                where: { like_id: existingLike.like_id }
            });
            return res.status(200).json({ message: "Post unliked successfully!" });
        } else {
            const newLike = await prisma.likes.create({
                data: {
                    post_id: parseInt(id),
                    user_id: userId
                }
            });
            return res.status(201).json({
                message: "Post liked successfully!",
                like: newLike
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getPostLikes(req, res) {
    const { id } = req.params;

    try {
        const likes = await prisma.likes.findMany({
            where: { post_id: parseInt(id) },
            include: {
                users: { 
                    select: {
                        user_id: true,
                        username: true,
                        profile_picture: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Likes fetched successfully",
            count: likes.length,
            likes: likes
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { toggleLike, getPostLikes };