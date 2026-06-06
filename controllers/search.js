const prisma = require("../prisma"); 

async function searchEverything(req, res) {
    try {
        const searchKeyword = req.cleanSearchQuery;

        const [matchedUsers, matchedPosts] = await Promise.all([
            prisma.users.findMany({
                where: {
                    OR: [
                        { username: { contains: searchKeyword, mode: "insensitive" } },
                        { bio: { contains: searchKeyword, mode: "insensitive" } }
                    ]
                },
                select: { user_id: true, username: true, profile_picture: true, bio: true }
            }),
            prisma.posts.findMany({
                where: {
                    post_content: { contains: searchKeyword, mode: "insensitive" }
                },
                include: {
                    users: { select: { username: true, profile_picture: true } }
                }
            })
        ]);

        return res.status(200).json({
            results: { users: matchedUsers, posts: matchedPosts }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { searchEverything };