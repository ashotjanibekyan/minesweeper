const db = require("../models");
const Result = db.result;

exports.submitResult = (req, res) => {
    const result = new Result({
        username: req.body.username,
        time: req.body.time,
        level: req.body.level,
        isWin: req.body.isWin
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
    await Result.find({ level: req.query.level, isWin: true }).sort({ time: 1 }).limit(10).then(results => data = results.map(result => {
        const { username, time, level, createdAt } = result;
        return {
            username, time, level, createdAt
        }
    }));
    res.json({ data });
}

exports.userData = async (req, res) => {
    const nGames = {};
    const nWins = {};
    const bests = {
        easy: +Infinity,
        medium: +Infinity,
        hard: +Infinity
    };

    for (let level of ['easy', 'medium', 'hard']) {
        await Result.find({ username: req.query.name, level: level }).then(results => {
            nGames[level] = results.length;
        });
        await Result.find({ username: req.query.name, isWin: true, level: level }).then(results => {
            nWins[level] = results.length;
        });
        await Result.find({ username: req.query.name, isWin: true, level: level }).sort({ time: 1 }).limit(1).then(result => {
            if (result.length > 0) {
                bests[level] = result[0].time;
            }
        });
    }

    res.json({ nGames, nWins, bests });
}