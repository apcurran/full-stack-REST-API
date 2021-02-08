"use strict";

// Initialize dotenv
require("dotenv").config();

const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_TLS_URL, {
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = redisClient;