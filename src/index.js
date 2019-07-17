require('./db/mongoose');

const bodyParser = require('body-parser');
const express = require('express');
const User = require('./models/User');
const Task = require('./models/Task');
const port = process.env.PORT || 3000;
const app = express();

// routes ==========================
const users = require('./routes/users');
const tasks = require('./routes/tasks');

const router = express.Router();

//  config
app.use(users);
app.use(tasks);

app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});