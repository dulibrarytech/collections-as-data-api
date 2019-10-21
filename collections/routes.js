/**
 * @file 
 *
 * Collections Routes
 *
 */
'use strict'

var Collections = require('./controller');

module.exports = function (app) {

    app.route('/')
        .get(function(req, res) {
            res.redirect("/collections");
    });

    app.get("/collections", (req, res, next) => {
        res.json(["John","Paul","George","Ringo"]);
    });
};