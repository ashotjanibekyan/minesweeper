const mongoose = require("mongoose");
const User = require("./user.model");

const Result = mongoose.model(
    "Result",
    new mongoose.Schema({
        username: String,
        time: Number,
        level: String,

    }, { timestamps: true })
);

module.exports = Result;
