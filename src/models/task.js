const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true,
        trim: true
    }
});

module.exports = Task;