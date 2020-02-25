"use strict";

module.exports = function(model) {
    return async function(req, res, next) {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
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

        try {

            results.results = await model
                .find()
                .limit(limit)
                .skip(startIndex)
                .exec();

            res.paginatedResults = results;
            next();

        } catch (err) {
            console.error(err);
            next(err);
        }
    };
};