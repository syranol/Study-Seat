import { StudySeatServer } from "./server";
/**
 * import environment variables from .env and make globally available
 */
require("dotenv").config();

/**
 * Entry point for StudySeat Node.JS server
 */
if (process.argv[2] !== "test") {
    const server = new StudySeatServer();
    const listenPort: number = parseInt(process.env.LISTEN_PORT as string);
    server.start(listenPort);
} else {

}