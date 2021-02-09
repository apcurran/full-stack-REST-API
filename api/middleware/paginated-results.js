"use strict";

const redisClient = require("../../redis/index");

module.exports = function(model) {
    return async function(req, res, next) {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        try {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            
            const results = {};
            
            if (endIndex < await model.countDocuments().lean().exec()) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }
            
            // Redis key
            const cacheKey = `homes:results:page:${page}:limit:${limit}`;
            let cacheEntry = await redisClient.get(cacheKey);

            if (cacheEntry) {
                cacheEntry = JSON.parse(cacheEntry);
                results.results = cacheEntry;

                res.paginatedResults = results;
                return next();
            }

            const homesResults = await model
                .find()
                .limit(limit)
                .skip(startIndex)
                .lean()
                .exec();

            results.results = homesResults;

            // Cache entry in Redis for future re-use
            redisClient.set(cacheKey, JSON.stringify(homesResults), "EX", 3600); // TTL set to 1 hr

            res.paginatedResults = results;
            next();

        } catch (err) {
            console.error(err);
            next(err);
        }
    };
};