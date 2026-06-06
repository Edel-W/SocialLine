const prisma = require("../prisma"); 
const bcrypt = require("bcrypt");

async function validateUser(req, res, next) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email and password are required"
            });
        }

        const [existingEmail, takenUsername] = await Promise.all([
            prisma.users.findUnique({ where: { email }}),
            prisma.users.findUnique({ where: { username }}),
        ]);

        if(existingEmail) {
            return res.status(409).json({
                field: "email",
                error: "An account already exists with this email!"
            });
        }

        if(takenUsername) {
            return res.status(409).json({
                field: "username",
                error: "Username is taken!"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateLogin (req, res, next) {
    try {
        const { username, password } = req.body; // Changed from identifier

        if(!username || !password) {
            return res.status(400).json({
                error: "Please provide your username and password."
            });
        }

        const user = await prisma.users.findUnique({
            where: { username: username } // Cleaner findUnique lookup
        });

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error: "Invalid username or password!"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateDeletion (req, res, next) {
    try {
        const { password } = req.body;
        const userId = req.user.user_id;

        if (!password) {
            return res.status(400).json({
                error: "Please provide your password to confirm account deletion."
            });
        }

        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(userId) }
        });

        if(!user) {
            return res.status(404).json({ error: "User not found."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                error: "Incorrect password. Account deletion canceled."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateUpdate (req, res, next) {
    try {
        const { password } = req.body;
        const userId = req.user.user_id;

        if(!password) {
            return res.status(400).json({
                error: "Please provide your password to confirm account update."
            });
        }

        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(userId) }
        });

        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                error: "Incorrect password. Account update cancelled."
            });
        }

        next();
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

async function validateGetUser (req, res, next) {
    const { id } = req.params; 

    try {
        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(id) }
        });

        if(!user) {
            return res.status(404).json({
                error: "The user does not exist!"
            });
        }

        req.fetchedUser = user;
        next();
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}
module.exports = {
    validateUser,
    validateLogin,
    validateDeletion,
    validateUpdate,
    validateGetUser
};