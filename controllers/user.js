const prisma = require("../prisma"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "the_super_secret_social_media_key";

async function registerUser(req, res) {
    const { username, email, password, profile_picture, bio } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profile_picture,
                bio: bio || ""
            }
        });

        return res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
                bio: user.bio
            }
        });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

async function loginUser (req, res) {
    try {
        const user = req.user;

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profile_picture: user.profile_picture
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
} 

async function deleteUser (req, res) {
    try {
        const userId = req.user.user_id;

        await prisma.users.delete({
            where: {
                user_id: userId
            }
        });

        return res.status(200).json({
            message: "User deleted successfully!"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updateUser (req, res) {
    try {
        const userId = req.user.user_id;
        const { username, bio, profile_picture } = req.body;

        const updatedUser = await prisma.users.update({
            where: { user_id: userId },
            data: {
                username,
                bio,
                profile_picture
            }
        });

        return res.status(200).json({
            message: "Update successful!",
            user: {
                user_id: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profile_picture: updatedUser.profile_picture
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getUser(req, res) {
    try {
        const user = req.fetchedUser;

        const [postsCount, followersCount, followingCount] = await Promise.all([
            prisma.posts.count({
                where: {
                    user_id: user.user_id
                }
            }),

            prisma.follows.count({
                where: {
                    following_id: user.user_id
                }
            }),

            prisma.follows.count({
                where: {
                    follower_id: user.user_id
                }
            })
        ]);

        return res.status(200).json({
            message: "User fetched successfully!",
            user: {
                user_id: user.user_id,
                username: user.username,
                bio: user.bio,
                profile_picture: user.profile_picture,
                posts_count: postsCount,
                followers_count: followersCount,
                following_count: followingCount
            }
        });

    } catch (error) {
        console.error("getUser Error:", error);

        return res.status(500).json({
            error: error.message
        });
    }
}
module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    getUser
};