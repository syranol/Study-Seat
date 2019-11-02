import { join } from "path";
import { IHttpRequest, IHttpResponse } from '../lib/interface/http.interface';
const Express = require("express");

export class StudySeatServer extends Express {
     private clientBundlePath = join(__dirname, "../client");

    constructor() {
        super();

        /** this appears to be necessary to avoid using Express prototype */
        Object.setPrototypeOf(this, StudySeatServer.prototype);
    }

    public start(port: number) {
        this.listen(port, (): void => {
            console.log(`Express server listening on port ${port}`);
        });

        this.use((req: IHttpRequest, res: IHttpResponse, next: () => { }) => {
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.use(require("body-parser").json());

        this.use(Express.static(this.clientBundlePath));

        this.get("/", (req: IHttpRequest, res: IHttpResponse) => {
            res.sendFile(join(this.clientBundlePath, "index.html"));
        });

        this.get("/api-key", (req: IHttpRequest, res: IHttpResponse) => {

            res.send({ api_key: process.env.API_KEY });
        });

        /** for debugging client from mobile devices */
        this.post("/", (req: any, res: any) => {
            console.log(req.body);
            res.end();
        });
    }
}
