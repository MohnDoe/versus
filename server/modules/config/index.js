module.exports = {
    tumblr: {
        consumer_key: process.env.TUMBLR_CONSUMER_KEY,
        consumer_secret: process.env.TUMBLR_CONSUMER_SECRET
    },
    sources: {
        madame: {
            name: 'ditesbonjourmadame',
        },
    },
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost/versus'
    },
}