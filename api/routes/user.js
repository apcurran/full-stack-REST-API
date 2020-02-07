const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/signup", async (req, res, next) => {
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

module.exports = router;