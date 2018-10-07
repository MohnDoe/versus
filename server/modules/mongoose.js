const Config = require('./config')
const mongoose = require('mongoose');

const logger = require('./logger').scope('mongoose');

mongoose.connect(Config.database.url)
    .then((e) => logger.success('Connected'))
    .catch((e) => {
        logger.fatal(e);
    })

module.exports = mongoose;