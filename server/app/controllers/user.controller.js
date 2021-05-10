const db = require("../models");
const Result = db.result;

exports.submitResult = (req, res) => {
    const result = new Result({
        username: req.body.username,
        time: req.body.time,
        level: req.body.level
    });
    result.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "Result was saved successfully!" });
    });
}

exports.top = async (req, res) => {
    let data = [];
    await Result.find({}).sort({ time: 1 }).limit(250).then(results => data = results.map(result => {
        const {username, time, level, createdAt} = result;
        return {
            username, time, level, createdAt
        }
    }));
    res.json({data});
}