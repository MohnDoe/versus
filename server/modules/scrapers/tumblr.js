const Promise = require('bluebird');

const logger = require('../logger');

const Tumblr = require('../tumblr');
const Converter = require('./converter');

const Madame = require('../models/madame');


function scrape(source = 'madame') {
    logger.start('Scraping tumblr', source);
    return new Promise((resolve, reject) => {
        return scrapePhotos(source)
            .then(() => {
                logger.complete('Scraping tumblr', source);
                resolve(true);
            })
    })
}

function scrapePhotos(source, offset = 0, total = 0, skiped = 0, added = 0) {
    logger.start('Scraping photos tumblr', source, offset);
    var photosToSave = [];
    var responseSize = 0;
    return new Promise((resolve, reject) => {
        return Tumblr.getPosts(source, 'photo', offset)
            .then((photos) => {
                responseSize = photos.length;
                if(photos.length == 0) {
                    logger.info('No more photos');
                    return 'done';
                }
                return Promise.each(photos, (photo) => {
                    photo = Converter.convertToMadame(photo);
                    var date = new Date(photo.date)
                    if ((date.getDay() == 6 || date.getDay() == 0) && date >= new Date('2016-05-20')) {
                        logger.info('Weekend!');
                        // console.log(photo);
                        skiped++;
                    } else {
                        logger.info('added!');
                        photosToSave.push(photo);
                    }
                })
                .then(() => {
                    // console.log(photosToSave);
                    total += responseSize;
                    added += photosToSave.length;
                    console.log(total, skiped, added);
                    return Madame.insertMany(photosToSave)
                        .then(() => {
                            return true;
                        })
                        .catch(() => {
                            return true;
                        })
                })
            })
            .then((cont) => {
                if(cont === true) {
                    return scrapePhotos(source, offset+responseSize, total, skiped, added);
                }
            })
    });
}

module.exports = {
    scrape
}