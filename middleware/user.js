const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
    ])

    if(existingEmail) {
        return res.status(409).json({
            field: "email",
            error: "An account already exists with this email!"});
    }

    if(takenUsername) {
        return res.status(409).json({
            field: "username",
            error: "Username is taken!"});
    }

    next();

   } catch (error) {
        return res.status(500).json({
            error: error.message
        });
   }
}

async function validateLogin (req, res, next) {
    try {
        const { identifier, password } = req.body; 

        if(!identifier || !password) {
            return res.status(400).json({
                error: "Please provide your email/username and password."
            });
        }

        const user = await prisma.users.findFirst({
            where:{
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if(!user) {
            return  res.status(401).json({
                error: "Invalid username, email or password!"
            });
        }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
            return res.status(401).json({
                error: "Invalid username, email or password!"
            });        
      }

      req.user = user;
      
        next();
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }

}

module.exports = {
    validateUser,
    validateLogin
};