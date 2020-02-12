"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const validate = require("../middleware/validate");

router.post("/signup", validate([

    // Validate req data
    check("name").notEmpty().escape(),
    check("email").notEmpty().escape(),
    check("password").notEmpty().trim().escape(),
    check("secret").trim().escape()

]), async (req, res, next) => {    
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({
            error: "Email already exists"
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
            error: err
        });
        
        next(err);
    }
});

router.post("/login", validate([

    // Validate req data
    check("email").notEmpty().escape(),
    check("password").notEmpty().trim().escape()

]), async (req, res, next) => {
    // Check if user exists

    try {
        
        const user = await User.findOne({ email: req.body.email });
    
        if (!user) {
            return res.status(400).json({
                error: "Email not found"
            });
        }
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
    
        if (!validPassword) {
            return res.status(400).json({
                error: "Authorization failed"
            });
        }
    
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
        // Remove password before sending back to client
        const moddedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin
        }
    
        res.json({
            token,
            moddedUser
        });


    } catch (err) {
        console.error(err);
        next(err);
    }

});

module.exports = router;