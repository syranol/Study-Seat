import { join } from "path";
import { IHttpRequest, IHttpResponse } from '../lib/interface/http.interface';
import * as request from "request";

const Express = require("express");
const BodyParser = require("body-parser");

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

        this.use(Express.urlencoded({ extended: false }))
        
        this.use(BodyParser.urlencoded({ extended: false }));
        this.use(BodyParser.json());

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
            /** 
             * login route takes user name and password to retrieve jwt token
             */
            const username = req.body.username;
            const password = req.body.password;
            const options = {
                method: "POST",
                url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`, 
                headers: { "content-type": "application/json" },
                body: {
                    grant_type: "password",
                    username: username,
                    password: password,

                    connection: "Username-Password-Authentication",
                    client_id: process.env.AUTH0_CLIENT_ID,  
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                },
                json: true
            };

            console.log("POSTING LOGIN");
            console.dir(options)

            request.post(options, (error: any, response: any, body: any) => {
                console.log("POST RESULT")
                console.dir(body);
                if (error) {
                    res.status(500).send(error);
                } else {
                    /** send JWT back */
                    res.status(200).send({ username: username, token: body })
                }
            });
        });

        this.post("/register", (req: any, res: any) => {
            const username = req.body.username;
            const password = req.body.password;
            const email = req.body.email;
            const options = {
                method: "POST",
                url: `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`, 
                headers: { "content-type": "application/json" },
                body: {
                    grant_type: "password",
                    username: username,
                    email: email,
                    password: password,
                    scope: "openid profile",
                    email_verified: false, 
                    verify_email: false, 
                    app_metadata: {},
                    connection: "Username-Password-Authentication",
                    client_id: process.env.AUTH0_CLIENT_ID,  
                    client_secret: process.env.AUTH0_CLIENT_SECRET
                },
                json: true
            };
            request.post(options, (error: any, response: any, body: any) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(201).send({ username: username, token: body });
                }
            });

        });
    }
}
