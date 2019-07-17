require('./db/mongoose');
const validateTaskEntries = require('./middleware/validateTaskEntries');
const validateUserEntries = require('./middleware/validateUserEntries');
const bodyParser = require('body-parser');
const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
const port = process.env.PORT || 3000;
const app = express();

const options = {
    new: true,
    runValidators: true
}

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//  ============== users routes ================
// gets all the users
app.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// find one user by id 
app.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// create new user
app.post('/users', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error)
    }

});

// update one user 
app.patch('/users/:id', validateUserEntries, async (req, res, next) => {
    updateObject = req.body;
    try {
        const newUser = await User.findByIdAndUpdate(req.params.id, updateObject, options);
        if (!newUser) {
            return res.send({
                message: "could not find the user"
            });
        }
        res.send(newUser);
    } catch (e) {
        res.send(e);
    }
});

//  =================== Task routes ===============

// get all tasks 
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(404).send(error)
    }
});

// get one task by id 
app.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        res.send(task);
    } catch (error) {
        res.status(404).send(error)
    }
});


// create a new task 
app.post('/tasks', async (req, res, next) => {
    const task = new Task(req.body);
    try {
        await task.save(task);
        res.send(task)
    } catch (error) {
        res.send(error);
    }
});
// update one task
app.patch('/tasks/:id', validateTaskEntries, async (req, res) => {
    const updateObject = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateObject, options);
        if (!updatedTask) {
            res.status(404).send({
                message: "could not find the task you were trying to update"
            });
        }
        res.send(updatedTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete task by id 
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send('could not find task');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});