const validateUserEntries = require('../middleware/validateUserEntries');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const options = {
    new: true,
    runValidators: true
}

router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
// '/users' === route 
//  ============== users routes ================
// gets all the users
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// find one user by id 
router.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// create new user
router.post('/users', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save(options);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error)
    }

});

// login user 
router.post('/users/login',  async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        res.send(user)
    } catch(error) {
        res.status(400).send({error: "Unable to login"});
    }
})

// update one user 
router.patch('/users/:id', validateUserEntries, async (req, res, next) => {
    const updateObject = Object.keys(req.body);
    try {
        // const newUser = await User.findByIdAndUpdate(req.params.id, updateObject, options);
        const user = await User.findById(req.params.id);
        updateObject.forEach((update) => {
            console.log(user)
            user[update] = req.body[update];
        });

        await user.save();

        if (!user) {
            return res.send({
                message: "could not find the user"
            });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({
                error: "Sorry, could not delete your user profile"
            })
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({
            error: "Server error"
        });
    }
});

module.exports = router;