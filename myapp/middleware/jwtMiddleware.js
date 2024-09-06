const jwt = require('jsonwebtoken');

// Secret key (you should store this in a secure place like environment variables)
require('dotenv').config();
var JWT_SECRET = process.env.JWT_SECRET;


// Middleware function to authenticate token
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.clearCookie('token');
        return res.redirect('/admin/login');
    }
}



module.exports = authenticateToken;
