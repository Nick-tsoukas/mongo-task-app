const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const validateTaskEntries = require('../middleware/validateTaskEntries');
const isAuth = require('../middleware/auth');
const Task = require('../models/Task');

const options = {
    new: true,
    runValidators: true
}

router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// create a new task 
router.post('/tasks', isAuth, async (req, res, next) => {

    const task = new Task({
        ...req.body,
        author: req.user.id
    });
    try {
        await task.save(task);
        res.send(task)
    } catch (error) {
        res.status(500).send(error);
    }
});

// update one task
router.patch('/tasks/:id', validateTaskEntries, async (req, res) => {
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
        res.status(500).send(error);
    }
});

// get all tasks 
router.get('/tasks', isAuth, async (req, res, next) => {
    try {
        /* alternative way to do this is ...
        await req.user.populate('tasks).execPopulate()
        This will return all the tasks that are virtually assigned to the user ... tasks that user created
        refer to the Task model >>> Task.js
        */

        const tasks = await Task.find({author: req.user.id});

        if (!tasks.length) {
            return res.status(404).send({
                message: "Could not any find tasks"
            });
        }
        res.send(tasks);
    } catch (error) {
        res.status(404).send(error)
    }
});

// get one task by id 
router.get('/tasks/:id', isAuth, async (req, res, next) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({
            _id,
            author: req.user.id
        });
        if (!task) {
            return res.status(404).send({
                message: "could not find the task"
            })
        }

        res.send(task);

    } catch (error) {
        res.send(error);
    }
});


// delete task by id 
router.delete('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send('could not find task to delete');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;