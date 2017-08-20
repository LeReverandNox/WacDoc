/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Loki = require("lokijs");

module.exports = function (server) {
    const config = server.app.config;

    const dbService = {
        init: function () {
            this._db = new Loki(`${config.uploadPath}/${config.dbName}`, { persistenceMethod: 'fs' });
            this._db.loadDatabase();
            return this;
        },
        getCollection: function (name) {
            const collection = this._db.getCollection(name) || this._addCollection(name);
            return collection;
        },
        _addCollection: function (name) {
            const collection = this._db.addCollection(name);
            return collection;
        },
        _save: function () {
            return this._db.saveDatabase();
        },
        insertInto: function (collectionName, data) {
            const collection = this.getCollection(collectionName);

            collection.insert(data);
            this._save();
            return;
        },
        removeFrom: function (collectionName, uuid) {
            const collection = this.getCollection(config.collectionName);

            collection.findAndRemove({ uuid: uuid });
            this._save();
            return;
        }
    };

    return dbService.init();
};