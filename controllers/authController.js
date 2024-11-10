import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req,res)  => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username, email, password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            status : 'Success',
            message: "User registered successfully",
            data : {
                id : newUser._id,
                username : newUser.username,
                password : newUser.password,
                createdAt : newUser.createdAt,
                updatedAt : newUser.updatedAt
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
              { id: user.id, name: user.name },
              process.env.JWT_SECRET,
              { expiresIn: "1h" } // Token akan kedaluwarsa dalam 1 jam
            );
      
            res.json({
              status: "success",
              message: "Login successfully",
              token,
              data: {
                id: user._id,
                username: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updateAt: user.updateAt,
              },
            });
          } else {
            res.status(401).json({ error: "Invalid email or password" });
          }
    } catch (error) {
        res.status(500).json({ error: "Failed to login user" });
    }
}

