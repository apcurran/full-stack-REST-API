const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    description: { type: String, required: true },
    agent: { type: String, required: true }
});

module.exports = mongoose.model("House", HouseSchema);