import { join } from "path";
import { IHttpRequest, IHttpResponse } from '../lib/interface/http.interface';
const Express = require("express");
const Bcrypt = require("bcrypt");

export class StudySeatServer extends Express {
    private clientBundlePath = join(__dirname, "../client");
    // private clientBundlePath = join(process.cwd(), "client/build");
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
        this.use(Express.urlencoded({ extended: false }))

        this.use(Express.static(this.clientBundlePath));

        this.get("/api-key", (req: IHttpRequest, res: IHttpResponse) => {

            res.send({ api_key: process.env.API_KEY });
        });

        this.get("*", (req: IHttpRequest, res: IHttpResponse) => {
            res.sendFile(join(this.clientBundlePath, "index.html"));
        });

        /** for debugging client from mobile devices */
        this.post("/", (req: any, res: any) => {
            console.log(req.body);
            res.end();
        });

        this.post("/login", (req: any, res: any) => {
            console.log("LOGIN ROUTE TRIGGERED");
            res.end();
        });

        this.post("/register", (req: any, res: any) => {
            console.log("REGISTER ROUTE TRIGGERED");
            res.redirect("/login");
            // try {
            //     Bcrypt.hash(req.body.password, 20).then((passwordHash: any) => {

            //         // console.dir({
            //         //     username: req.body.username,
            //         //     email: req.body.email,
            //         //     password: req.body.passwordHash
            //         // });

            //         // /** redirect the user to the login page */
            //         // res.redirect("/login");

            //         // TODO: validate
            //         // TODO: put user in database
            //     });

            // } catch {

            //     res.end();
            // }

        });
    }
}
