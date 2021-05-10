const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String
    })
);

module.exports = User;
