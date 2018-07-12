const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    birthdate: Date,
    username: String,
    address: String,
    postalcode: String,
    city: String,
    country: String,
    telephone: Number,
    email: String,
    password: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;