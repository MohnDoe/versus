const mongoose = require('../mongoose');

var madameSchema = mongoose.Schema({
    tumblrID: {
        type: Number,
        unique: true
    },
    postURL: String,
    date: Date,
    timestamp: Number,
    tumblrShortURL: String,
    summary: String,
    caption: String,
    imagePermalink: String,
    imageURL: String,
    imageWidth: Number,
    elo: {
        type: Number,
        default: 1400
    },
    matchCount: Number,
    victoryCount: Number,
    looseCount: Number,
    drawCount: Number
})

module.exports = mongoose.model('madame', madameSchema);