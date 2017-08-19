/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const del = require("del");

module.exports = (server) => {
    const config = server.app.config;
    const fileService = {
        upload: async function (file) {
            if (!file)
                throw new Error("No file to upload.");

            const realName = file.hapi.filename;
            const newName = uuid.v1();
            const filePath = path.join(config.uploadPath, newName)

            try {
                await this._save(file, filePath);

                const infos = {
                    realName,
                    name: newName,
                    size: fs.statSync(filePath).size,
                    path: filePath,
                    basePath: config.uploadPath,
                    mimetype: file.hapi.headers['content-type']
                };

                return infos;
            } catch (e) {
                await this._delete(filePath);
                throw e;
            }
        },
        _save: async (buffer, path) => {
            const ws = fs.createWriteStream(path);

            return new Promise((resolve, reject) => {
                buffer.on('error', (err) => {
                    reject(err);
                });

                buffer.on('end', (err) => {
                    resolve();
                });

                buffer.pipe(ws);
            });
        },
        _delete: async (path) => {
            return del(path);
        },
        init: function () {
            return this;
        },
    };

    return fileService.init();
};