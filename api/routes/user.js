"use strict";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const FavoriteHome = require("../models/FavoriteHome");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", validate([

    // Validate req data
    check("name").notEmpty().escape(),
    check("email").notEmpty().escape(),
    check("password").notEmpty().trim().escape(),
    check("secret").trim().escape()

]), async (req, res, next) => {    
    const emailExists = await User.findOne({ email: req.body.email }).lean();

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
        const user = await User.findOne({ email: req.body.email }).lean();
    
        if (!user) {
            return res.status(400).json({
                error: "Email not found"
            });
        }
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
    
        if (!validPassword) {
            return res.status(400).json({
                error: "Password incorrect"
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
    
        res.status(201).json({
            token,
            moddedUser
        });


    } catch (err) {
        next(err);
    }

});

router.get("/dashboard", checkAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).lean();
        const moddedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin
        };

        res.status(200).json(moddedUser);

    } catch (err) {
        next(err);
    }
});

router.get("/favorites", checkAuth, async (req, res, next) => {
    try {
        const favoriteHomes = await FavoriteHome.find({ user_id: req.user._id }).lean();
        
        res.status(200).json(favoriteHomes);

    } catch (err) {
        next(err);
    }
});

router.post("/favorites", checkAuth, async (req, res, next) => {
    try {
        const favoriteHome = new FavoriteHome({
            user_id: req.user._id,
            home_id: req.body.home_id,
            home_price: req.body.home_price,
            home_street: req.body.home_street,
            home_state: req.body.home_state,
            home_bedrooms: req.body.home_bedrooms,
            home_bathrooms: req.body.home_bathrooms,
            home_squareFeet: req.body.home_squareFeet,
            home_img_main: req.body.home_img_main
        });

        await favoriteHome.save();

        res.status(201).json({
            message: "House added to your dashboard favorites!"
        });

    } catch (err) {
        next(err);
    }
});

router.delete("/favorites/:homeId", checkAuth, async (req, res, next) => {
    try {
        const query = { user_id: req.user._id, home_id: req.params.homeId }

        await FavoriteHome.findOneAndRemove(query);

        res.status(200).json({
            message: "Home deleted!"
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;