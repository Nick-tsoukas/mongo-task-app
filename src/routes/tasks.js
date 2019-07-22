const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const validateTaskEntries = require('../middleware/validateTaskEntries');
const Task = require('../models/Task');

const options = {
    new: true,
    runValidators: true
}

router.use(express.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
//  =================== Task routes ===============
// get all tasks 
router.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find({});
        if(!tasks.length) {
            return res.status(404).send( { message: "Could not any find tasks"});
        }
        res.send(tasks);
    } catch (error) {
        res.status(404).send(error)
    }
});

// get one task by id 
router.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        res.send(task);
    } catch (error) {
        res.status(404).send({ message: "Can't find task", error});
    }
});

function myName(req, res, next){
    req.name = 'nick';
    next()
}
// create a new task 
router.post('/tasks', myName, async (req, res, next) => {
    const task = new Task(req.body);
    try {
        await task.save(task);
        console.log(req.name)
        res.send({task, name: req.name})
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