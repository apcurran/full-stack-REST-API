"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const House = require("../models/House");
const { body } = require("express-validator")
const checkAuth = require("../middleware/check-auth");
const validate = require("../middleware/validate");
const paginatedResults = require("../middleware/paginatedResults");
// Utility Functions
const titleCase = require("../utility/title-case");

// Multer Setup
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });
const cpUpload = upload.fields([
    { name: "agent_img", maxCount: 1 },
    { name: "house_img_main", maxCount: 1 },
    { name: "house_img_inside_1", maxCount: 1 },
    { name: "house_img_inside_2", maxCount: 1 },
]);

// GET all homes
router.get("/", paginatedResults(House), async (req, res, next) => {
    res.status(200).json(res.paginatedResults);
});

// GET a specific home
router.get("/:homeId", async (req, res, next) => {
    try {

        const home = await House.findById(req.params.homeId);

        res.json(home);

    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });

        next(err);
    }
});

// GET specific homes based on search query
router.post("/search", async (req, res, next) => {
    try {
        
        // Search by street, city, state, or zip
        const query = {$or: [
            { street: titleCase(req.body.searchTerm) },
            { city: titleCase(req.body.searchTerm) },
            { state: titleCase(req.body.searchTerm) },
            { zip: req.body.searchTerm }
        ]};
        const homeResults = await House.find(query);

        res.json(homeResults);

    } catch (err) {
        console.error(err);
        res.json({
            error: err
        });

        next(err);
    }
});

// AUTH protected routes

// POST to create a new home
router.post("/new", checkAuth, cpUpload, validate([
    body("price").notEmpty().trim(),
    body("street").notEmpty().trim(),
    body("city").notEmpty().trim(),
    body("state").notEmpty().trim(),
    body("zip").notEmpty().trim(),
    body("lat").notEmpty().trim(),
    body("lon").notEmpty().trim(),
    body("bedrooms").notEmpty().trim(),
    body("bathrooms").notEmpty().trim(),
    body("squareFeet").notEmpty().trim(),
    body("description").notEmpty().trim(),
    body("agent").notEmpty().trim(),
    body("agent_phone").notEmpty().trim(),
]), async (req, res, next) => {

    try {
        const home = new House({
            price: req.body.price,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            lat: req.body.lat,
            lon: req.body.lon,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            squareFeet: req.body.squareFeet,
            description: req.body.description,
            agent: req.body.agent,
            agent_img: `http://localhost:5000/${req.files.agent_img[0].path}`,
            agent_phone: req.body.agent_phone,
            house_img_main: `http://localhost:5000/${req.files.house_img_main[0].path}`,
            house_img_inside_1: `http://localhost:5000/${req.files.house_img_inside_1[0].path}`,
            house_img_inside_2: `http://localhost:5000/${req.files.house_img_inside_2[0].path}`,
        });

        await home.save();

        res.status(201).json({
            message: "New home created!"
        });
    } catch (err) {
        console.error(err);
        res.json({
            error: err
        });

        next(err);
    }
});

// PATCH an existing home
router.patch("/update", checkAuth, cpUpload, async (req, res, next) => {
    try {
        const query = { street: req.body.streetQuery };
        const updateObject = req.body;
        
        await House.findOneAndUpdate(query, { $set: updateObject });

        res.json({
            message: "Home updated!"
        });
    } catch (err) {
        console.error(err);
        res.json({
            error: err
        });

        next(err);
    }
});

// DELTE an existing home
router.delete("/delete", checkAuth, validate([
    body("streetQuery").notEmpty().trim()
]), async (req, res, next) => {
    try {
        const query = { street: req.body.streetQuery };

        await House.findOneAndRemove(query);

        res.json({
            message: "Home deleted!"
        });
    } catch (err) {
        console.error(err);
        res.json({
            error: err
        });

        next(err);
    }
});

module.exports = router;