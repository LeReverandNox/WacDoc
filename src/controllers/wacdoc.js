/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const services = server.app.services;
    const config = server.app.config;

    const wacdocController = {
        indexAction: async (req, rep) => {
            rep.view("index");
        },
        uploadAction: async (req, rep) => {
            try {
                const payload = req.payload;
                const file = payload["file"];
                const infos = await services.file.upload(file);

                services.db.insertInto(config.collectionName, infos);

                rep().code(200);
            } catch (e) {
                console.log(e);
                rep("Something went wrong !");
            }
        }
    };

    return wacdocController;
};