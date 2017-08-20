/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const services = server.app.services;
    const config = server.app.config;

    const wacdocController = {
        indexAction: async (req, rep) => {
            const files = await services.file.getList();

            rep.view("index", {
                files
            });
        },
        uploadAction: async (req, rep) => {
            try {
                const payload = req.payload;
                const file = payload["file"];
                const infos = await services.file.upload(file);

                services.db.insertInto(config.collectionName, infos);

                return rep().redirect("/");
            } catch (e) {
                console.log(e);
                return rep.redirect("/")
            }
        },
        downloadAction: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;
            const file = await services.file.getContent(uuid);
            const fileInfos = await services.file.getByUUID(uuid);

            if (!file)
                return rep().redirect('/');

            rep(file)
                .header('Content-Type', fileInfos.mimetype)
                .header("Content-Disposition", `filename="${fileInfos.realName}"`);
        },
        deleteAction: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;
            const fileInfos = await services.file.getByUUID(uuid);

            if (!fileInfos)
                return rep().redirect('/');

            await services.file.deleteByUUID(uuid);
            services.db.removeFrom(config.collectionName, fileInfos.uuid);

            return rep().redirect('/');
        },
        createAction: async (req, rep) => {
            const payload = req.payload;
            const fileName = payload.filename;

            try {
                if(!fileName || !fileName.match(/.+\.mywac$/))
                    throw new Error("Filename is not correct (*.mywac)");

                const infos = await services.file.create(fileName);
                services.db.insertInto(config.collectionName, infos);

                return rep().redirect("/");
            } catch (e) {
                console.log(e);
                return rep().redirect("/");

            }
        },
        updateAction: async (req, rep) => {
            const payload = req.payload;
            const uuid = payload.uuid;
            const content = payload.content;
            console.log(content);
            const fileInfos = await services.file.getByUUID(uuid);

            if (!fileInfos)
                return rep().redirect('/');
            if (!fileInfos.isWac)
                return rep().redirect('/');

            try {
                await services.file.update(uuid, content);
                return rep().redirect("/");
            } catch (e) {
                console.log(e);
                return rep().redirect("/");
            }

        },
        editAction: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;
            const fileInfos = await services.file.getByUUID(uuid);

            if (!fileInfos)
                return rep().redirect('/');
            if (!fileInfos.isWac)
                return rep().redirect('/');

            rep.view("edit", {
                fileInfos
            });
        },
        getTextContentAction: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;

            const fileInfos = await services.file.getByUUID(uuid);

            try {
                if (!fileInfos)
                    throw new Error("File doesn't exists.");
                if (!fileInfos.isWac)
                    throw new Error("File is not of mywac type.");

                const content = await services.file.getTextContent(uuid);
                return rep({content});
            } catch (e) {
                console.log(e);
                return rep("File not found.").code(404);
            }
        },
        exportHTML: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;
            const fileInfos = await services.file.getByUUID(uuid);

            try {
                if (!fileInfos)
                    throw new Error("File doesn't exists.");
                if (!fileInfos.isWac)
                    throw new Error("File is not of mywac type.");

                const htmlFile = await services.file.exportHTML(uuid);

                return rep(htmlFile)
                    .header('Content-Type', 'text/html')
                    .header("Content-Disposition", `attachment; filename="${fileInfos.realName}.html"`);
            } catch(e) {
                console.log(e);
                return rep().redirect('/');
            }
        },
        exportPDF: async (req, rep) => {
            const params = req.params;
            const uuid = params.uuid;
            const fileInfos = await services.file.getByUUID(uuid);

            try {
                if (!fileInfos)
                    throw new Error("File doesn't exists.");
                if (!fileInfos.isWac)
                    throw new Error("File is not of mywac type.");

                const pdfFile = await services.file.exportPDF(uuid);

                return rep(pdfFile)
                    .header('Content-Type', 'application/pdf')
                    .header("Content-Disposition", `attachment; filename="${fileInfos.realName}.pdf"`);
            } catch (e) {
                console.log(e);
                return rep().redirect('/');
            }

        },
    };

    return wacdocController;
};