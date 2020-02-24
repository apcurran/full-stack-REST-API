"use strict";

const mongoose = require("mongoose");

const FavoriteHomeSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    home_id: { type: String, required: true },
    home_price: { type: String, required: true },
    home_street: { type: String, required: true },
    home_state: { type: String, required: true },
    home_bedrooms: { type: String, required: true },
    home_bathrooms: { type: String, required: true },
    home_squareFeet: { type: String, required: true },
    home_img_main: { type: String, required: true }
});

module.exports = mongoose.model("FavoriteHome", FavoriteHomeSchema);