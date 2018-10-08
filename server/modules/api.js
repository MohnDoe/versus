var fs = require("fs");
var _ = require("lodash");
var App = require("../app");
var Config = require("./config");
var auth = require('./auth/index');
var Validate = require('validate.js');
var Promise = require('bluebird');

//var endpoints = {};

module.exports = {
    generateAuthMiddleware: function(action) {
        return function(req, res, next) {
            if (action.auth) {
                action.auth(req)
                    .then(function() {
                        return next();
                    })
                    .catch(function(error) {
                        //todo: error code
                        res.status(400).send(error.message);
                    });
            } else {
                //We are still here. Everything must be ok. Let's continue!
                next();
            }
        };

    },

    generateValidateMiddleware: function(action) {

        //todo: ensure arrays/strings are in order before continuing

        return function(req, res, next) {

            var promises = [];

            //Route has validation
            if (action.validate && action.validate.params) promises.push(Validate.async(req.params, action.validate.params));
            if (action.validate && action.validate.query) promises.push(Validate.async(req.query, action.validate.query));
            if (action.validate && action.validate.body) promises.push(Validate.async(req.body, action.validate.body));

            Promise.all(promises).then(function(paramsErrors, queryErrors, bodyErrors) {
                next();
            }).catch(function(err) {
                res.status(400).json({
                    status: 'notvalid',
                    field_errors: err
                });
            })

        };

    },
    
    init: function() {

        console.log("> Loading API endpoints")

        //Read though the files
        var files = fs.readdirSync(__dirname + "/../api");
        for (var i = 0; i < files.length; i++) {

            //Just making sure that they are .js files
            if (files[i].indexOf('.js') == -1) continue;

            //For every thingamajig, set up the endpoints + auth
            var api_name = files[i].replace('.js', '');
            var endpoint = require("../api/" + files[i]);
            console.log("  - " + api_name);

            //todo: implement endpoint custom auth

            //Custom routes first, so that /resource/yaddayadda is caught before /resource/123
            if (endpoint.custom) {
                for (var j = 0; j < endpoint.custom.length; j++) {
                    var route = endpoint.custom[j];
                    console.log("    - (" + route.method + ")" + route.url);
                    App[(route.method || 'get').toLowerCase()](Config.server.api_base + '/' + api_name + route.url, auth.middleware, this.generateAuthMiddleware(route), this.generateValidateMiddleware(route), route.handler);
                }
            }
            if (endpoint.crud.list) App.get(Config.server.api_base + '/' + api_name, auth.middleware, this.generateAuthMiddleware(endpoint.crud.list), this.generateValidateMiddleware(endpoint.crud.list), endpoint.crud.list.handler);
            if (endpoint.crud.create) App.post(Config.server.api_base + '/' + api_name, auth.middleware, this.generateAuthMiddleware(endpoint.crud.create), this.generateValidateMiddleware(endpoint.crud.create), endpoint.crud.create.handler);
            if (endpoint.crud.delete) App.delete(Config.server.api_base + '/' + api_name, auth.middleware, this.generateAuthMiddleware(endpoint.crud.delete), this.generateValidateMiddleware(endpoint.crud.delete), endpoint.crud.delete.handler);
            if (endpoint.crud.update) App.put(Config.server.api_base + '/' + api_name + "/:id", auth.middleware, this.generateAuthMiddleware(endpoint.crud.update), this.generateValidateMiddleware(endpoint.crud.update), endpoint.crud.update.handler);
            if (endpoint.crud.read) App.get(Config.server.api_base + '/' + api_name + "/:id", auth.middleware, this.generateAuthMiddleware(endpoint.crud.read), this.generateValidateMiddleware(endpoint.crud.read), endpoint.crud.read.handler);

            //Todo: children. /post/123/comments
        }

        //Api invalid urls (valid urls will be handled before this)
        App.all([Config.server.api_base + '/*', Config.server.api_base], function(req, res) {
            res.status(404).send('Invalid endpoint: ' + req.method + ' ' + req.path);
        });

        console.log(" > API endpoints loaded");
    }
};