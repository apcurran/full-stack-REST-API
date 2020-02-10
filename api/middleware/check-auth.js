const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("authToken");

    if (!token) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.user = verified;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};