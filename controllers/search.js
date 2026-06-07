const prisma = require("../prisma");

async function searchEverything(req, res) {
    const q = req.cleanSearchQuery; 

    try {
        const users = await prisma.users.findMany({
            where: {
                username: {
                    contains: q,         
                    mode: 'insensitive' 
                }
            },
            select: {
                user_id: true,
                username: true,
                profile_picture: true,
                bio: true
            }
        });

        return res.status(200).json({ results: users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { searchEverything };