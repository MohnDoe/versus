var Promise = require('bluebird');
var Express = require('express');
var BodyParser = require('body-parser');
var ExpressSession = require('express-session');
var Compression = require('compression');

var _ = require('lodash');
var mongoose = require('./modules/mongoose');
var Config = require('./modules/config');
var Models = require('./modules/models');
var Ops = require('./modules/operators');

Promise.config({
    warnings: false
});


var app = module.exports = Express();



//Configure the app
app.use(Compression()); //https://github.com/expressjs/compression
app.use(BodyParser.json()); // for parsing application/json
app.use(BodyParser.urlencoded({
    extended: true
})); // for parsing       application/x-www-form-urlencoded

console.log("> Storing sessiondata in REDIS");
var RedisStore = require('connect-redis')(ExpressSession);
app.use(ExpressSession({
    store: new RedisStore({
        client: require("./modules/redis").client
    }),
    secret: Config.server.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        maxAge: 30 * 24 * 3600000
    }
}));

//Start webserver
var server = module.exports.server = app.listen(Config.server.port, function() {
    console.log("Server listening on port %s", Config.server.port);
});
try {


    //Authorization module
    require('./modules/auth/index').init();

    //Normal routing
    require('./modules/routes');

    //Api endpoints
    require('./modules/api').init();

} catch (err) {
    console.log(err);
}
