var App, Config, Express;

//Todo: We might be able to delete this entire file - We won't have any real routes besides the API (handled in api.js) - the rest is Angular.

Config = require('./config');
App = require('../app');
Express = require('express');
var fs = require('fs');


// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
App.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
// App.use(function(req, res, next) {
//     if (process.env.NODE_ENV == "production") {
//         if (req.secure) {
//             // request was via https, so do no special handling
//             next();
//         } else {
//             // request was via http, so redirect to https
//             res.redirect('https://' + req.headers.host + req.url);
//         }
//     } else {
//         next();
//     }
// });

if (Config.server.cors_enabled) {
    //MISC - Allow CORS (api only)
    App.all('/api/*', function(req, res, next) {
        res.status(200);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    App.options('*', function(req, res) {
        res.sendStatus(200);
    });
}

//Regular static files, and if not found, the index file. Angular will handle 404's - This should come at the very LAST
var cacheAge = process.env.NODE_ENV == 'production' ? 86400000 : 0; //One day
var index_html_dir = '/../../dist';
if (process.env.NODE_ENV != 'production') {
    index_html_dir = '/../../public'
}

// App.use(Express.static(__dirname + index_html_dir, {
//     maxAge: cacheAge
// }));

// App.use(function(req, res) {
//     //todo: read file and inject meta shit + if dev, no maxage
//     res.sendFile('index.html', {
//         root: __dirname + index_html_dir
//     });
// });

//Handle errors
//Todo: overhaul this
App.use(function(err, req, res, next) {

    if (err.name == 'ValidationError') {

        var messages = {};
        var messagesArray = [];
        for (var field in err.errors) {
            if (!err.errors.hasOwnProperty(field)) continue;
            messages[field] = err.errors[field].message;
            messagesArray.push(err.errors[field].message);
        }

        //if (req.xhr) {
        res.status(400).send(messages);
        //} else {
        //    res.status(400).send(messagesArray.join("<br>"));
        //}

    } else {

        //  http://www.bennadel.com/blog/2828-creating-custom-error-objects-in-node-js-with-error-capturestacktrace.htm
        //console.log(err);
        console.log(err.stack);
        //res.status(err.httpStatus ? err.httpStatus : 400).send(err.customMessage ? err.customMessage : err.message);
        res.status(500).send(err.message);

        //if (process.env.NODE_ENV != 'production') {

        //console.log(err.captureStackTrace(this));

        //res.status(500).send(err.message);
        //}

        //TODO URGENT

        //Still unhandled,
        //  In development -> spit out the a 500 message and continue.
        //  In production or anything else -> spit out a generic 500 message, stop accepting new requests, email developers, and shut down the server in 5 seconds

        //if (process.env.NODE_ENV == 'development') {
        //    res.status(500).send("UNHANDLED: " + err.message);
        //
        //} else {
        //
        //    console.error("!! UNHANDLED EXCEPTION - SHUTTING DOWN SERVER !!");
        //    console.error(err);
        //    res.status(500).send("Something has gone wrong. Our developers have been notified. This is not your fault");
        //    App.server.close();
        //    setTimeout(function () {
        //        process.exit(1);
        //    }, 5000);
        //
        //}

    }
});