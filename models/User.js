const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
    name: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

schema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', schema);