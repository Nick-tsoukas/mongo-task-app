require('./db/mongoose');

const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get('/users', (req, res, next) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            res.status(400).send(err)
        });
});

app.get('/users/:id', (req, res, next) => {
    const _id = req.params.id;
    User.findById(_id)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            res.send(err);
        });
})

app.post('/users', (req, res, next) => {
    const user = new User(req.body);

    user.save()
        .then((user) => {
            console.log('user should have been created')
            res.send(user);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

app.post('/tasks', (req, res, next) => {
    const task = new Task(req.body);

    task.save()
        .then((task) => {
            res.send(task);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

app.get('/tasks', (req, res, next) => {
    Task.find({})
        .then((tasks) => {
            res.status(200).send(tasks);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

// count all task

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
       res.send(data)
    })
    .catch((err) => {
        res.send(err);
    });
});

app.get('/tasks/:id', (req, res, next) => {
    const _id = req.params.id;

    Task.findById(_id)
        .then((task) => {
            res.status(200).send(task);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

// update routes

app.patch('/users/:id/:name', (req, res, next) => {
    const options = { useFindAndModify: false, new: true };
    const _id = req.params.id;
    const name = req.params.name;

    User.findByIdAndUpdate(_id, {name}, options)
        .then((user) =>  {
            res.send(user);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
})




app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});