const jwt = require('jsonwebtoken');
const { secret_key } = require('../config/jwt');


const authenticateToken = (req, res, next) => {

    //get authorization header which contain authentication credentials
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secret_key, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// New function for role-based authorization
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!roles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
};



module.exports = { authenticateToken, authorizeRole };