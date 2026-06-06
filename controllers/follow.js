const prisma = require("../prisma"); 

async function toggleFollow(req, res) {
    const { id } = req.params; 
    const loggedInUserId = req.user.user_id; 

    try {
        const existingFollow = await prisma.follows.findFirst({
            where: {
                follower_id: loggedInUserId,
                following_id: parseInt(id)
            }
        });

        if (existingFollow) {
            await prisma.follows.delete({
                where: { follow_id: existingFollow.follow_id }
            });
            return res.status(200).json({ message: "Successfully unfollowed user." });
        } else {
            const newFollow = await prisma.follows.create({
                data: {
                    follower_id: loggedInUserId,
                    following_id: parseInt(id)
                }
            });
            return res.status(201).json({
                message: "Successfully followed user!",
                follow: newFollow
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getFollowers(req, res) {
    const { id } = req.params; 

    try {
        const followers = await prisma.follows.findMany({
            where: { following_id: parseInt(id) },
            include: {
                users_follows_follower_idTousers: { // Matched to schema relation name!
                    select: { user_id: true, username: true, profile_picture: true }
                }
            }
        });

        return res.status(200).json({
            message: "Followers fetched successfully",
            count: followers.length,
            followers: followers.map(f => ({
                follow_id: f.follow_id,
                created_at: f.created_at,
                user: f.users_follows_follower_idTousers
            }))
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getFollowing(req, res) {
    const { id } = req.params;

    try {
        const following = await prisma.follows.findMany({
            where: { follower_id: parseInt(id) },
            include: {
                users_follows_following_idTousers: { 
                    select: { user_id: true, username: true, profile_picture: true }
                }
            }
        });

        return res.status(200).json({
            message: "Following fetched successfully",
            count: following.length,
            following: following.map(f => ({
                follow_id: f.follow_id,
                created_at: f.created_at,
                user: f.users_follows_following_idTousers
            }))
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { toggleFollow, getFollowers, getFollowing };