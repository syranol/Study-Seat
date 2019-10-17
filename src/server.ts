import express = require("express");
import { join } from "path";

const api = express();
const port = 3001;

export const start = () => {
    api.listen(port, (): void => {
        console.log(`Express server listening on port ${port}`);
    });
    
    api.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3001");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    api.use(express.static(join(__dirname, "../build/client")))

    api.get("/hello", (req, res) => {
        console.log("HELLO")
        res.json({ hello: "HELLO" });
    });
}