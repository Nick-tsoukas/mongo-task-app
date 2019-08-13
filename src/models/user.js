const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// password hash
userSchema.pre('save', async function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password,8);
    user.password = hash;
    next()
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    return obj;
   }

// instance method
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, 'secretkey');

    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}

userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error("Could not find account ... please try again")
    }
    const isAuth = await bcrypt.compare(password, user.password);

    if(!isAuth) {
        throw new Error("Unable to login in ... Please try again");
    }

    return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;