/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = function (server) {
    const wacdocController = {
        indexAction: function (req, rep) {
            rep.view("index");
        }
    };

    return wacdocController;
};