/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const del = require("del");

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const fileService = {
        upload: async function (file) {
            if (!file)
                throw new Error("No file to upload.");

            const realName = file.hapi.filename;
            const uuid = Uuid.v1();
            const filePath = path.join(config.uploadPath, uuid)

            try {
                await this._save(file, filePath);

                const ext = realName.split('.').pop();
                const infos = {
                    realName,
                    uuid: uuid,
                    size: fs.statSync(filePath).size,
                    path: filePath,
                    basePath: config.uploadPath,
                    mimetype: file.hapi.headers['content-type'],
                    ext,
                    isWac: this._isWac(ext),
                    isDownloadable: this._isDownloadable(ext)
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
        getByUUID: async function (uuid) {
            const file = services.db.getCollection(config.collectionName).findOne({uuid: uuid});
            return file;
        },
        getList: async function () {
            const files = services.db.getCollection(config.collectionName).find();
            return files;
        },
        getContent: async function (uuid) {
            const file = await this.getByUUID(uuid);
            if (!file)
                return null;

            return new Promise((resolve, reject) => {
                fs.readFile(file.path, (err, data) => {
                    if (err)
                        return reject(err);
                    return resolve(data);
                });
            });
        },
        deleteByUUID: async function (uuid) {
            const file = await this.getByUUID(uuid);
            if (!file)
                return null;

            try {
                this._delete(file.path);
                services.db.getCollection(config.collectionName).findAndRemove({uuid: file.uuid});
            } catch (e) {
                console.log(e);
            }

        },
        _isDownloadable: (ext) => {
            const extensions = config.downloadableExtensions;
            return extensions.indexOf(ext) > -1;
        },
        _isWac: (ext) => {
            if (ext === "mywac")
                return true;
            return false;
        },
        create: async function (name) {
            const ext = name.split('.').pop();
            if (ext !== "mywac")
                return false;

            const uuid = Uuid.v1();
            const filePath = path.join(config.uploadPath, uuid);

            fs.closeSync(fs.openSync(filePath, 'w'));

            const infos = {
                realName: name,
                uuid: uuid,
                size: fs.statSync(filePath).size,
                path: filePath,
                basePath: config.uploadPath,
                mimetype: "application/octet-stream",
                ext,
                isWac: this._isWac(ext),
                isDownloadable: this._isDownloadable(ext)
            };

            return infos;
        }
    };

    return fileService.init();
};