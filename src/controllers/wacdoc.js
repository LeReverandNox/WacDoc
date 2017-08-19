/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const services = server.app.services;

    const wacdocController = {
        indexAction: async (req, rep) => {
            rep.view("index");
        },
        uploadAction: async (req, rep) => {
            try {
                const payload = req.payload;
                const file = payload["file"];
                const infos = await services.file.upload(file);
                console.log(infos);

                rep("GG WP");
            } catch (e) {
                console.log(e);
                rep("Something went wrong !");
            }
        }
    };

    return wacdocController;
};