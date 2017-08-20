/*jslint this:true es6:true for:true */
/*global window document io $ randomColor*/

"use strict";

(function (global) {
    var WacDoc = function () {
        this.fileUUID = window.location.href.match(/\/edit\/(.*)$/)[1];

        this.textBox = document.getElementById("textBox");
        this.editForm = document.getElementById("edit-form");
        this.content = document.getElementById("content");
        this.titleSelect = document.getElementById("title-select");
        this.colorSelect = document.getElementById("color-select");
        this.boldButton = document.getElementById("bold-button");
        this.boldButton = document.getElementById("bold-button");
        this.italicButton = document.getElementById("italic-button");
        this.underlineButton = document.getElementById("underline-button");
        this.numberedListButton = document.getElementById("numbered-list-button");
        this.dottedListButton = document.getElementById("dotted-list-button");
    };

    WacDoc.prototype.init = function () {
        var self = this;

        this.getTextContent(function (content) {
            self.textBox.innerHTML = content;
            self.launchEditor();
        });
    };

    WacDoc.prototype.getTextContent = function (cb) {
        var url = "/gettextcontent/" + this.fileUUID;

        $.get(url, function (res) {
            cb(res.content);
        });
    };

    WacDoc.prototype.launchEditor = function () {
        this.startEventListeners();
    };

    WacDoc.prototype.startEventListeners = function () {
        this.editForm.addEventListener("submit", this.submit.bind(this));
        this.titleSelect.addEventListener("change", this.titleChange.bind(this));
        this.colorSelect.addEventListener("change", this.colorChange.bind(this));
        this.boldButton.addEventListener("click", this.boldChange.bind(this));
        this.italicButton.addEventListener("click", this.italicChange.bind(this));
        this.underlineButton.addEventListener("click", this.underlineChange.bind(this));
        this.numberedListButton.addEventListener("click", this.numberedListChange.bind(this));
        this.dottedListButton.addEventListener("click", this.dottedListChange.bind(this));
    };

    WacDoc.prototype.format = function (cmd, value) {
        document.execCommand(cmd, false, value);
        this.textBox.focus();
    };

    WacDoc.prototype.titleChange = function (e) {
        var elem = e.target;
        this.format("formatblock", elem[elem.selectedIndex].value);
        elem.selectedIndex = 0;
    };

    WacDoc.prototype.colorChange = function (e) {
        var elem = e.target;
        this.format("forecolor", elem[elem.selectedIndex].value);
        elem.selectedIndex = 0;
    };

    WacDoc.prototype.boldChange = function (e) {
        this.format("bold");
    };

    WacDoc.prototype.italicChange = function (e) {
        this.format("italic");
    };

    WacDoc.prototype.underlineChange = function (e) {
        this.format("underline");
    };

    WacDoc.prototype.numberedListChange = function (e) {
        this.format("insertorderedlist");
    };

    WacDoc.prototype.dottedListChange = function (e) {
        this.format("insertunorderedlist");
    };

    WacDoc.prototype.submit = function (e) {
        this.content.value = this.textBox.innerHTML;
        return true;
    };

    document.addEventListener("DOMContentLoaded", function () {
        var wd = new WacDoc();
        wd.init();
    });

    global.WacDoc = WacDoc;
}(window));
