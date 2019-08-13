const jwt = require('jsonwebtoken');
const User = require('../models/User');
const isAuth = async function (req, res, next) {
    try {
        // Bearer is send in the header from the client ... server only needs the token not "Bearer "
        // Bearer just allows us to know that it is a bearer token
        const token = req.header('Authorization').replace("Bearer ", '');
        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token' : token});

        if(!user) {
            throw new Error();
        }
        // sets req.user to the mongo user document
        req.token = token;
        req.user = user;
        next()
    } catch {
        res.status(401).send("Please login ...");
    }
}

module.exports = isAuth;