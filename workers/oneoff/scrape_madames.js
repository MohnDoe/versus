var Promise = require('bluebird');
var mongoose = require('../../server/modules/mongoose');
var Config = require('../../server/modules/config');

const TumblrScraper = require('../../server/modules/scrapers/tumblr');

mongoose.connect(Config.database.url)
    .then(() => {
        TumblrScraper.scrape('madame');
    })