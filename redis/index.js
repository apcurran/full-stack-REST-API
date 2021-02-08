"use strict";

// Initialize dotenv
require("dotenv").config();

const Redis = require("ioredis");
const redisClient = new Redis(process.env.REDIS_TLS_URL, {
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = redisClient;