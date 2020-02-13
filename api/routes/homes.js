"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const House = require("../models/House");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const validate = require("../middleware/validate");

// GET all homes
router.get("/", async (req, res, next) => {
    try {
        const allHomes = await House.find();

        res.status(200).json(allHomes);
    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });

        next(err);
    }
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

// POST to create a new home
router.post("/new", validate([

    // Validate req data
    check("price").notEmpty().escape(),
    check("street").notEmpty().escape(),
    check("city").notEmpty().escape(),
    check("state").notEmpty().escape(),
    check("zip").notEmpty().escape(),
    check("lat").notEmpty(),
    check("lon").notEmpty(),
    check("bedrooms").notEmpty().escape().isNumeric(),
    check("bathrooms").notEmpty().escape().isNumeric(),
    check("squareFeet").notEmpty().escape().isNumeric(),
    check("description").notEmpty().escape(),
    check("agent").notEmpty().escape(),
    check("agent_img").notEmpty(),
    check("house_img_main").notEmpty(),
    check("house_img_inside_1").notEmpty(),
    check("house_img_inside_2").notEmpty()

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
            agent_img: req.body.agent_img,
            house_img_main: req.body.house_img_main,
            house_img_inside_1: req.body.house_img_inside_1,
            house_img_inside_2: req.body.house_img_inside_2,
        });

        await home.save();

        res.status(201).json({
            message: "New home created!"
        });
    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });

        next(err);
    }
});

// PATCH an existing home
router.patch("/:homeId", checkAuth, async (req, res, next) => {
    try {
        const updatedHome = await House.findByIdAndUpdate(req.params.homeId, { $set: { street: req.body.street } });

        res.json({
            message: "Home updated!"
        });
    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });

        next(err);
    }
});

// DELTE an existing home
router.delete("/:homeId", checkAuth, async (req, res, next) => {
    try {
        const removedHome = await House.findByIdAndRemove(req.params.homeId);

        res.json(removedHome);
    } catch (err) {
        console.error(err);
        res.json({
            message: err
        });

        next(err);
    }
});

module.exports = router;