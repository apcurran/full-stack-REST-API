"use strict";

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};