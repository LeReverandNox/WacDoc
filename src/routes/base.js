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
        },
        {
            method: "GET",
            path: "/download/{uuid}",
            handler: controllers.wacdoc.downloadAction
        },
        {
            method: "GET",
            path: "/delete/{uuid}",
            handler: controllers.wacdoc.deleteAction
        },
        {
            method: "POST",
            path: "/create",
            handler: controllers.wacdoc.createAction
        }
    ];

    server.route(baseRoutes);
};
