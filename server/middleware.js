// middleware.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("unauthorized!");
    res.status(401).json({ message: 'Unauthorized' });
};

module.exports = isAuthenticated;

