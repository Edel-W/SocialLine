const prisma = require("../prisma"); 

async function validateFollowToggle(req, res, next) {
    try {
        const { id } = req.params; 
        const loggedInUserId = req.user.user_id;

        if (parseInt(id) === loggedInUserId) {
            return res.status(400).json({ error: "You cannot follow yourself!" });
        }

        const targetUserExists = await prisma.users.findUnique({
            where: { user_id: parseInt(id) }
        });

        if (!targetUserExists) {
            return res.status(404).json({ error: "The user you are trying to follow does not exist!" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateGetFollows(req, res, next) {
    try {
        const { id } = req.params;

        const userExists = await prisma.users.findUnique({
            where: { user_id: parseInt(id) }
        });

        if (!userExists) {
            return res.status(404).json({ error: "User profile not found." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { validateFollowToggle, validateGetFollows };