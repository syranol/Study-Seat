"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = require("path");
const api = express();
const port = 3001;
exports.start = () => {
    api.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
    api.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3001");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    api.use(express.static(path_1.join(__dirname, "../build/client")));
    api.get("/", (req, res) => {
        console.log("HERE");
        res.sendFile(path_1.join(__dirname, "../build/client/index.html"));
    });
    api.get("/hello", (req, res) => {
        console.log("HER");
        res.json({ hello: "HELLO" });
    });
};
