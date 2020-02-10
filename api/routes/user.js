const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {    
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    try { 

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const secret = req.body.secret;

        if (secret === "supersecret") {
            // Create an admin
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                secret: req.body.secret,
                admin: true
            });
    
            await user.save();
            res.status(201).json({
                message: "Admin created!"
            });
        } else {
            // Create a user
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
    
            await user.save();
            res.status(201).json({
                message: "User created!"
            });
        }
    

    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });
        
        next(err);
    }
});

router.post("/login", async (req, res) => {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).json({
            message: "Email not found"
        });
    }

    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).json({
            message: "Authorization failed"
        });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

    res.header("authToken", token).json(token);
});

module.exports = router;