const prisma = require("../prisma"); 

async function createPost (req, res) {
    const { post_content } = req.body;
    const userId = req.user.user_id;

    const image_url = req.file ? req.file.path : null; 

    try {
        const post = await prisma.posts.create({
            data: {
                post_content: post_content,
                user_id: userId,
                image_url: image_url },
            include: {
                users: {
                    select: { 
                        username: true, 
                        profile_picture: true 
                    }
                }
            }
        });

        return res.status(201).json({
            message: "Post created Successfully!",
            post: {
                post_id: post.post_id,
                post_content: post.post_content,
                image_url: post.image_url, 
                user_id: post.user_id,
                created_at: post.created_at,
                author: post.users 
        }});
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getFeed(req, res) {
    try {
        const posts = await prisma.posts.findMany({
            orderBy: { created_at: "desc" },
            include: {
                users: { select: { username: true, profile_picture: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });

        const formattedFeed = posts.map(item => ({
            post_id: item.post_id,
            caption: item.post_content,
            image_url: item.image_url,
            author_id: item.user_id,
            author_username: item.users.username,
            author_profile_picture: item.users.profile_picture,
            created_date: item.created_at,
            like_count: item._count.likes,
            comment_count: item._count.comments
        }));

        return res.status(200).json({ feed: formattedFeed });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function deletePost(req, res) {
    const { id } = req.params;
    try {
        await prisma.posts.delete({ where: { post_id: parseInt(id) } });
        return res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updatePost (req, res) {
    const { id } = req.params;
    const { post_content } = req.body;

    try {
        const post = await prisma.posts.update({
            where: { post_id: parseInt(id) },
            data: { post_content: post_content },
            include: { users: { select: { username: true, profile_picture: true } } }
        });

        return res.status(200).json({
            message: "Post updated successfully!",
            post: {
                post_id: post.post_id,
                post_content: post.post_content,
                user_id: post.user_id,
                updated_at: post.updated_at,
                author: post.users
            }
        });
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}

async function getPost (req, res) {
    try {
        const post = req.post;
        const detailedPost = await prisma.posts.findUnique({
            where: { post_id: post.post_id },
            include: {
                users: { select: { username: true, profile_picture: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });

        return res.status(200).json({
            message: "Post fetched successfully",
            post: {
                post_id: detailedPost.post_id,
                post_content: detailedPost.post_content,
                image_url: detailedPost.image_url,
                user_id: detailedPost.user_id,
                created_at: detailedPost.created_at,
                author: detailedPost.users,
                like_count: detailedPost._count.likes,
                comment_count: detailedPost._count.comments
            }
        });
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
} 

module.exports = {
    createPost, 
    deletePost,
    updatePost,
    getPost,
    getFeed 
};