const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
})
  
// static signup method
UserSchema.statics.signup = async function (email, password, name) {

    //validation
    if (!email || !password || !name) {
        throw Error('Please fill in all fields', email, password, name);
    }
    if (!validator.isEmail(email)) { // not valid!
        throw Error('Not a valid email');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already exists.')
    }

    // salt added to end of password... 10 values
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, name });

    return user;
}

//static login method
UserSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('Please fill in all fields');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }
    return user;
}

module.exports = mongoose.model('User', UserSchema)