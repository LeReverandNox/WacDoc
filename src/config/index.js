module.exports = {
    server: {
        port: 3000
    },
    uploadPath: "/src/uploads/",
    dbName: "db.json",
    collectionName: "files",
    downloadableExtensions: [
        "htm",
        "html",
        "pdf",
        "jpeg",
        "jpg",
        "png",
        "gif",
        "txt",
        "mywac"
    ],
    masterKey: process.env.MASTERKEY
};