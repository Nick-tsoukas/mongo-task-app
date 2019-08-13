const validateUserEntries = require('../middleware/validateUserEntries');
const isAuth = require('../middleware/auth');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// to be passed in for mongoose ... will return the updated document and run validators 
const options = {
    new: true,
    runValidators: true
}

router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// Create new user public route ... uses the generateAuthToken method to get jwt token
router.post('/users', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save(options);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error)
    }

});

// Login user public route authenticates by email and password >>> then generates a token
router.post('/users/login',  async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch(error) {
        res.status(400).send({error: "Unable to login"});
    }
});

//  Logout user on one device 
router.post('/users/logout', isAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send({ message: "You have successfully logged out"});
    } catch {
        res.status(500).send({ message: "could not log out ... please try again"})
    }
});
// Logs out of all devices by setting the user tokens to an empty array
router.post('/users/logoutAll',isAuth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send( {message: "You are now logged out of all devices"})
    } catch(error) {
        res.status(500).send({message: "Unable to log out of all devices"})
    }
});

// Profile ... sent from the isAuth middleware 
router.get('/users/profile', isAuth, async (req, res, next) => {
    res.send(req.user);
});

// Update Profile 
router.patch('/users/profile', isAuth, validateUserEntries, async (req, res, next) => {
    const updateObject = Object.keys(req.body);
    try {
        updateObject.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete user route
router.delete('/users/profile', isAuth, async (req, res, next) => {
    try {
        // isAuth assigns req.user to the authenticated user ... find by id and delete
       const user = await User.findByIdAndDelete(req.user.id);
       res.send(user);
    } catch (error) {
        res.status(400).send({
            error: "Server error"
        });
    }
});

module.exports = router;