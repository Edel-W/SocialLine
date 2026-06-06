const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPost (req, res) {
        const { post_content, image_url } = req.body;

        const userId = req.user.user_id;

    try {
        const post = await prisma.posts.create ({
            data: {
                post_content: post_content,
                user_id: userId,
                image_url: image_url
            }
        });

        return res.status(201).json({
            message: "Post created Successfully!",
            post: {
                post_id: post.post_id,
                post_content: post.post_content,
                user_id: post.user_id,
                created_at: post.created_at
            }
        })


    } catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


async function deletePost(req, res) {
    
    const { id } = req.params;
    
    try {
        await prisma.posts.delete({
            where: { post_id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Post deleted successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

async function updatePost (req, res) {
    const { id } = req.params;
    const { post_content } = req.body;

    try{

        const post = await prisma.posts.update({
            where: { post_id: parseInt(id) },
            data: {
                post_content: post_content
            }
        });

        return res.status(200).json({
            message: "Post updated successfully!",
            post: {
                post_id: post.post_id,
                post_content: post.post_content,
                user_id: post.user_id,
                updated_at: post.updated_at
            }
        });

    } catch(error){
        return res.status(500).json({
            error: error.message
        });
    }
}

async function getPost (req, res) {
    try {
        const post = req.post;

        return res.status(200).json({
            message: "Post fetched successfully",
            post: {
                post_id: post.post_id,
                post_content: post.post_content,
                user_id: post.user_id,
                created_at: post.created_at

            }
        });
        
    } catch(error){
        return res.status(500).json({
            error: error.message
        });
    }

} 

module.exports = {
    createPost,
    deletePost,
    updatePost,
    getPost
}