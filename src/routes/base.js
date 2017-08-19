/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
module.exports = function (server) {
    const controllers = server.app.controllers;

    const baseRoutes = [
        {
            method: "GET",
            path: "/",
            handler: controllers.wacdoc.indexAction
        }
    ];

    server.route(baseRoutes);
};
