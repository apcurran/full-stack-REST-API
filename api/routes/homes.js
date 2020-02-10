const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const House = require("../models/House");
const { check, validationResult } = require("express-validator");
const checkAuth = require("../middleware/check-auth");

function validate(validations) {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);

        if (errors.isEmpty()) return next();

        res.status(422).json({ errors: errors.array() });
    }
}

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
router.post("/new", checkAuth, validate([

    // Validate req data
    check("street").notEmpty().escape(),
    check("city").notEmpty().escape(),
    check("state").notEmpty().escape(),
    check("zip").notEmpty().escape(),
    check("bedrooms").notEmpty().escape().isNumeric(),
    check("bathrooms").notEmpty().escape().isNumeric(),
    check("squareFeet").notEmpty().escape().isNumeric(),
    check("description").notEmpty().escape(),
    check("agent").notEmpty().escape()
    
]), async (req, res, next) => {
    try {
        const home = new House({
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            squareFeet: req.body.squareFeet,
            description: req.body.description,
            agent: req.body.agent
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