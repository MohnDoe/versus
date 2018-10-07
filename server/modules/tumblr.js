const tumblr = require('tumblr.js');
const Promise = require('bluebird');
const Config = require('./config');

const logger = require('./logger').scope('operators', 'tumblr');

console.log(Config);
const Tumblr = tumblr.createClient({
    credentials: {
        consumer_key: Config.tumblr.consumer_key,
        consumer_secret: Config.tumblr.consumer_secret,
    },
    returnPromises: true,
});

function getLastPhoto(source = 'madame') {
    var tumblrSource = Config.sources[source].name;
    logger.time('getLastPhoto');
    logger.start('Fetching last photo', source);
    return new Promise(function(resolve, reject) {
        return Tumblr.blogPosts(tumblrSource, { type: 'photo', limit: 1 })
            .then(function(res) {
                if (res.posts.length > 0) {
                    logger.complete('Fetching last photo', source);
                    logger.timeEnd('getLastPhoto');
                    resolve(res.posts[0]);
                } else {
                    resolve(false);
                }
            })
            .catch(function(e) {
                reject(e);
            })
    });
}

function getPosts(source = 'madame', type = 'photo', offset = 0) {
    var tumblrSource = Config.sources[source].name;
    logger.time('getPosts');
    logger.start('Getting post', type, offset, source);
    return new Promise(function(resolve, reject) {
        return Tumblr.blogPosts(tumblrSource, { type: type, limit: 20, offset: offset })
            .then(function(res) {
                resolve(res.posts);
            })
            .catch(function(e) {
                console.log(e);
                reject(e);
            })
    });
}

function getPhotoCount(source = 'madame') {
    var tumblrSource = Config.sources[source].name;
    logger.time('getPhotoCount');
    logger.start('Counting photos', source);
    return new Promise(function(resolve, reject) {
        return Tumblr.blogPosts(tumblrSource, { type: 'photo', limit: 20 })
            .then(function(res) {
                logger.complete('Counting photos', source);
                logger.info('# photos', source, res.total_posts);
                logger.timeEnd('getPhotoCount');
                resolve(res.total_posts);
            })
            .catch(function(e) {
                reject(e);
            })
    });
}

function getRandomPhoto(source = 'madame') {
    var tumblrSource = Config.sources[source].name;
    logger.time('getRandomPhoto');
    logger.start('Fetching random photo', source);
    return new Promise(function(resolve, reject) {
        return getPhotoCount(source)
            .then(function(count) {
                var random_number = Math.floor(Math.random() * count);
                return Tumblr.blogPosts(tumblrSource, { type: 'photo', limit: 1, offset: random_number })
            })
            .then(function(res) {
                logger.complete('Fetching random photo', source);
                logger.timeEnd('getRandomPhoto');
                if (res.posts.length > 0) {
                    logger.info('Photo found')
                    resolve(res.posts[0]);
                } else {
                    logger.warn('No photo found')
                    resolve(false);
                }
            })
            .catch(function(e) {
                reject(e);
            })
    });
}

module.exports = {
    getLastPhoto,
    getRandomPhoto,
    getPosts,
}