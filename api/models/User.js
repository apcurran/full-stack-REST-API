"use strict";

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 1000 },
    email: { type: String, required: true, min: 1, max: 1000 },
    password: { type: String, required: true, min: 6, max: 1000 },
    secret: { type: String },
    admin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);