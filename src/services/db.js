/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Loki = require("lokijs");

module.exports = function (server) {
    const config = server.app.config;

    const dbService = {
        init: function () {
            this._db = new Loki(`${config.uploadPath}/${config.dbName}`, { persistenceMethod: 'fs' });

            return this;
        },
        hello: function () {
            return "Hello DB";
        }
    };

    return dbService.init();
};