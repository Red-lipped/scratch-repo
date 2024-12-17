// const express = require("express")
// const router = express.Router()
// import { Request, Response, NextFunction } from 'express';

// // import the Schema so we can manipulate


// router.get('/', (req: Request,res:Response) => {
//     res.status(200).json({message: 'user list'})
// })

// // we need to encrypt our password to create a new user
// router.post('/new', (req: Request,res:Response) => {
//     res.status(200).json({message: 'new user form'})
// })

// //
// router.put('/update', (req:Request, res:Response)=>{

// })

// module.exports = router
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
import { Request, Response } from "express";
import UserModel from "../model.js"; // Import the User schema

// User Signup Route
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { nickName, userName, password, accountType, email } = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new UserModel({
            nickName,
            userName,
            password: hashedPassword,
            accountType,
            email,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        // MongoDB duplicate key error code
        if (error.code === 11000) {
            return res.status(400).json({ message: "UserName or Email already exists" });
        }

        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// User Login Route
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;

        // Check if the user exists
        const user = await UserModel.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, userName: user.userName },
            process.env.JWT_SECRET as string, // Ensure type safety
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
