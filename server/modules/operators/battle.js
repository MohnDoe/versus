const Promise = require('bluebird');

const Models = require('../models');

function getNew() {
    return new Promise((resolve, reject) => {
        Models.madame.find(
            {}, 
            null, 
            {
                limit:2,
            }
        )
        .sort({elo: 1})
        .then((candidates) => {
            console.log(candidates);
            resolve(candidates);
        })
    })
}

module.exports = {
    getNew
}