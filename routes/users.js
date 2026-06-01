const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { validateUser, validateLogin } = require("../middleware/user");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

router.get("/" , (req, res) => {
    res.send({ data: "Users data fetched"});
});

router.post("/", validateUser, async (req, res) => {
        const { username, email, password, profile_picture, bio } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: { 
                username, 
                email, 
                password: hashedPassword,
                profile_picture, 
                bio
            }
        });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({
            error: error.message});
    }
});

router.post("/", validateLogin, (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong during the login completion."
        })
    }
});

router.put("/:id", (req,res) => {
    res.send( { data: "User data updated!"});
});

router.delete("/:id", (req,res) => {
    res.send( { data: "User deleted!"});
});

module.exports = router;