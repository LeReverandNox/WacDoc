/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Hapi = require("hapi");
const ejs = require("ejs");
const inert = require("inert");
const vision = require("vision");
const config = require("./config");
const routes = require("./routes");
const controllers = require("./controllers");
const services = require("./services");

const fs = require("fs");
const Loki = require("lokijs");

if (!fs.existsSync(config.uploadPath)) {
    fs.mkdirSync(config.uploadPath);
}

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    }
});

server.app.db = new Loki(`${config.uploadPath}/${config.dbName}`, { persistenceMethod: 'fs' });

server.connection({
    port: config.server.port
});

server.register([
    vision,
    inert,
    controllers,
    services,
    routes
], function (err) {
    if (err) {
        throw err;
    }

    server.views({
        engines: {
            ejs
        },
        relativeTo: __dirname,
        path: "views"
    });

    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log(`The WacDoc app is now running on port ${server.info.port}`);
    });
});