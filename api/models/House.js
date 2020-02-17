"use strict";

const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema({
    price : { type: Number, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    lat: { type: String, required: true },
    lon: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    description: { type: String, required: true },
    agent: { type: String, required: true },
    agent_img: { type: String, required: true },
    agent_phone: { type: String, required: true },
    house_img_main: { type: String, required: true },
    house_img_inside_1: { type: String, required: true },
    house_img_inside_2: { type: String, required: true },
});

module.exports = mongoose.model("House", HouseSchema);