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
        },
        {
            method: "POST",
            path: "/upload",
            handler: controllers.wacdoc.uploadAction,
            config: {
                payload: {
                    maxBytes: 100000000,
                    output: "stream",
                    allow: 'multipart/form-data'
                }
            }
        }
    ];

    server.route(baseRoutes);
};
