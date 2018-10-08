//Promise = require("bluebird");
var Passport = require('passport');
var App = require("../../app");
var Models = require("../models");
var Config = require("../config");

var userCache = {};

module.exports = {
    init: function() {

        //Auth Middleware
        App.use(Passport.initialize());
        this.middleware = Passport.session();

        //User serialisation
        Passport.serializeUser(function(user, done) {
            return done(null, user.id);
        });

        //And deserialisation
        Passport.deserializeUser(function(id, done) {
            // console.log("User check");

            if (userCache[id]) {
                return done(null, userCache[id][0]);
            }

            return Models.user.findById(id).then(function(user) {
                if (user) {
                    userCache[user.id] = [
                        user, setTimeout(function() {
                            // console.log("Deleted cache #" + id);
                            delete userCache[user.id];
                        }, Config.auth.userCacheTime)
                    ];
                    done(null, user);
                }
                if (!user) {
                    return done(null, false);
                }
            });
        });

        // require("./social").init();
        // require("./local.js").init();
    },

    middleware: null,
};