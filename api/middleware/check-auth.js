const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        
        console.log(token);

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};