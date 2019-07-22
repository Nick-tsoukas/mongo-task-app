const jwt = require('jsonwebtoken');
const User = require('../models/User');
const isAuth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace("Bearer ", '');
        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token' : token});

        if(!user) {
            throw new Error();
        }
        req.user = user;
        next()
    } catch {
        res.status(401).send("Please login ...");
    }
}

module.exports = isAuth;