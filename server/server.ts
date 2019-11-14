import { join } from "path";
import { IHttpRequest, IHttpResponse } from '../lib/interface/http.interface';
const Express = require("express");
const Bcrypt = require("bcrypt");
const Passport = require("passport");
const PassportInit = require("./passport-init");
const BodyParser = require("body-parser");




const users: any[] = [];




PassportInit(Passport, 
    (username: any) => users.find((user: any) => user.username === username));

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
        // this.use(require("express-flash"));
        this.use(require("express-session")({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        this.use(Passport.initialize());
        this.use(Passport.session());
        
        this.use(BodyParser.json());
        this.use(BodyParser.urlencoded({ extended: false }));

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

        this.post("/login", Passport.authenticate("local"), function(req: any, res: any) {
            console.log(req.user);
            console.log("UP HERE")
            // Passport.authenticate("local", (err: any, user: any, info: any) => {
                console.log("IN HERE")

                // if (err) { return next(err); }
                
                console.log("HERE")

                res.status(200).json({
                    username: req.body.username
                });
            // });
        });

        // this.post("/login", (req: any, res: any) => {
        //     if ((req.body.username === "a" && req.body.password === "a")
        //      || (req.body.username === "b" && req.body.password === "b")) {
        //         res.status(200).json({
        //             username: req.body.username
        //         });
        //     } else {
        //         res.status(401).error("Bad password")
        //     }
        // });

        this.post("/register", (req: any, res: any) => {
            if (req.body.username === "c") {
                res.status(401).json("Bad username")
            }
            
            Bcrypt.hash(req.body.password, 10).then((passwordHashed: string) => {
                users.push({
                    username: req.body.username,
                    email: req.body.email,
                    password: passwordHashed
                });
                console.log(users);
                res.status(200).json({
                    username: req.body.username,
                });
            }).catch((err: Error) => {
                console.error(err);
                res.send(err);
            });



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
