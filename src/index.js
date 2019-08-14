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

//  config for the routes ... 
app.use(users);
app.use(tasks);

app.listen(port, () => {
    console.log(`The server is now listening on port ${port}`);
});

const main = async () => {
   const user = await User.findById('5d532972d84602adb28ec035');
   await user.populate('userTasks').execPopulate();
   console.log(user.userTasks)
}

main()