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
        url: process.env.MONGODB_URI || 'mongodb://localhost/versus',
        redis_url: process.env.REDIS_URL
    },
    server: {
        api_base: '/api',
        port: process.env.PORT || 8081,
        host: process.env.HOST,
        session_secret: process.env.SESSION_SECRET || "session_secret",
        process_name: process.env.DYNO || process.env.NODE_ENV + '-' + (Math.random() * 10000).toString(32),
        jwt_secret: process.env.JWT_SECRET || 'secret',
    }
}