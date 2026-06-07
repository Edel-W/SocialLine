const prisma = require("../prisma");

async function followUser(req, res) {
    const followerId = req.user.user_id; 
    
    const targetId = req.params.id || req.body.followingId;   

    if (!targetId) {
        return res.status(400).json({ error: "Missing target user ID to follow." });
    }

    if (followerId === parseInt(targetId)) {
        return res.status(400).json({ error: "You cannot follow your own profile." });
    }

    try {
        const follow = await prisma.follows.create({
            data: {
                follower_id: followerId,
                following_id: parseInt(targetId)
            }
        });
        return res.status(201).json({ message: "Successfully followed user.", follow });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "You are already following this user." });
        }
        return res.status(500).json({ error: error.message });
    }
}

async function unfollowUser(req, res) {
    const followerId = req.user.user_id;
    const targetId = req.params.id || req.params.followingId;

    if (!targetId) {
        return res.status(400).json({ error: "Missing target user ID to unfollow." });
    }

    try {
        await prisma.follows.delete({
            where: {
                follower_id_following_id: {
                    follower_id: followerId,
                    following_id: parseInt(targetId)
                }
            }
        });
        return res.status(200).json({ message: "Successfully unfollowed user." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getFollowLists(req, res) {
    const targetId = req.params.id || req.params.userId;

    if (!targetId) {
        return res.status(400).json({ error: "Missing user ID to fetch follow lists." });
    }

    try {
        const profileData = await prisma.users.findUnique({
            where: { user_id: parseInt(targetId) },
            include: {
                follows_follows_follower_idTousers: { 
                    include: { users_follows_following_idTousers: { select: { username: true, profile_picture: true } } }
                },
                follows_follows_following_idTousers: { 
                    include: { users_follows_follower_idTousers: { select: { username: true, profile_picture: true } } }
                },
                _count: {
                    select: {
                        follows_follows_follower_idTousers: true, 
                        follows_follows_following_idTousers: true  
                    }
                }
            }
        });

        if (!profileData) {
            return res.status(404).json({ error: "User profile record not found." });
        }

        return res.status(200).json({
            follower_count: profileData._count.follows_follows_following_idTousers,
            following_count: profileData._count.follows_follows_follower_idTousers,
            followers: profileData.follows_follows_following_idTousers,
            following: profileData.follows_follows_follower_idTousers
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    followUser,
    unfollowUser, 
    getFollowLists
};