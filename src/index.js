require('./db/mongoose');

const bodyParser = require('body-parser');
const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



// gets all the users
app.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// find one users by id 
app.get('/users/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
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

// get all tasks 
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(404).send(error)
    }
});

// return the amount of all task >> integer
app.get('/tasks/count', (req, res, next) => {
    Task.find({})
        .then((task) => {
            let todos = task.filter((task) => {
                return task.completed === false;
            });
            return todos;
        })
        .then((todos) => {

            const data = {
                count: todos.length,
                todos
            };

            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

// get one task by id 
app.get('/tasks/:id', async (req, res, next) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        res.send(task);
    } catch (error) {
        res.status(404).send(error)
    }
});

// update routes
app.patch('/users/:id', async (req, res, next) => {
    const _id = req.params.id;
    updateObject = req.body;
    try {
        const newUser = await User.findByIdAndUpdate(_id, updateObject, {new: true});
        if(!newUser){
            return res.send({message: "could not find the user"});
        }
        res.send(newUser);
    } catch(e) {
        res.send(e);
    }
});

// delete task by id 
app.delete('/tasks/:id', async (req, res, next) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            res.status(404).send('could not find task');
        }
        res.send(task);
    } catch (error) {
        res.send(error);
    }
})




app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});