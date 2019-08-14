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

// virtual is not saved to the database it's just a way for mongoose to create relationship between documents
userSchema.virtual('userTasks', {
    ref: 'Task',
    // user id ... user id is what is used on the task document to create the relationship
    localField: '_id',
    // the property on the task that is used to create the relationship between the two documents
    foreignField: 'author'
})

// password hash
userSchema.pre('save', async function (next) {
    var user = this;
    // if the user is already created and is updating profile without modifying the password exit out of this function next()
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

// when sending user profile to the client this hides the password and tokens 
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    return obj;
   }

// instance method
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // embeds the user id into the token
    const token = jwt.sign({ _id: user.id.toString() }, 'secretkey');

    // adds the token to a tokens array ... allows for logging in on multiple devices
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}

userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error("Could not find account ... please try again")
    }
    //  this checks if password is correct ... if successful then return user object
    const isAuth = await bcrypt.compare(password, user.password);

    if(!isAuth) {
        throw new Error("Unable to login in ... Please try again");
    }

    return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;