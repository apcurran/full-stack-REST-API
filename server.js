const express = require("express");
const app = express();
const logger = require("morgan");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

// Import routes

require("dotenv").config();

// Use Morgan for dev logging
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
});

// Handle 404 Error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;

    next(error);
});

// Catch other errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));