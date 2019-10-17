"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
if (process.argv[2] !== "test") {
    server_1.start();
}
else {
}
