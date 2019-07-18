const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (!value) {
                throw new Error('You must enter a valid age!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (validator.contains(value, 'password')) {
                throw new Error("Your password can't be password");
            }
        }
    }
});

userSchema.pre('save', async function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password,8);
    user.password = hash;
    next()
})


const User = mongoose.model('User', userSchema);

module.exports = User;