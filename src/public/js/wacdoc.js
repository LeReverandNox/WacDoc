/*jslint this:true es6:true for:true */
/*global window document io $ randomColor*/

"use strict";

(function (global) {
    var WacDoc = function () {
        this.fileUUID = window.location.href.match(/\/edit\/(.*)$/)[1];
    };

    WacDoc.prototype.init = function () {
        var self = this;

        this.getTextContent(function () {
            console.log(self.originalContent);
            self.launchEditor();
        });
    };

    WacDoc.prototype.getTextContent = function (cb) {
        var self = this;
        var url = "/gettextcontent/" + this.fileUUID;
        $.get(url, function (res) {
            self.originalContent = res.content;
            cb();
        });
    };

    WacDoc.prototype.launchEditor = function () {
        console.log("C'est ti-part pour le RTE");
    };

    document.addEventListener("DOMContentLoaded", function () {
        var wd = new WacDoc();
        wd.init();
    });

    global.WacDoc = WacDoc;
}(window));
