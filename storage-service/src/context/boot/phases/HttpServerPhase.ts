import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as http from "http";
import * as https from "https";
import * as passport from "passport";
import * as path from "path";
import { Action, useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";

import { Application } from "../../Application";
import { AppError, CustomErrors } from "../../components/AppErrors";
import { Configuration } from "../../components/Configuration";
import { Logger } from "../../components/Logger";
import { Passport } from "../../components/Passport";

import { BootPhase } from "../BootPhase";

/**
 * HttpServer Boot Phase
 * @category Boot Phase
 * @class HttpServerPhase
 * @description Https boot phase.
 * Configure here middlewares as express, cors, helmet
 * Manage https support
 */

export class HttpServerPhase implements BootPhase {

    /**
     * @method execute
     * @description Execute initialization
     * @param app
     * @return Promise
     */
    public execute(app: Application): Promise<any> {
        const logger = Container.get<Logger>(Logger);
        logger.info("[BOOT] HttpServerPhase started");
        this.initWebServer(app, logger);
        logger.info("[BOOT] HttpServerPhase done!");
        return Promise.resolve(true);
    }

    private initWebServer(app: Application, logger: Logger): void {

        const config = Container.get<Configuration>(Configuration);

        const scc = config.get<string>("service.context");
        const serviceContext = (scc === "") ? "" : `/${scc}`;

        const exp = express();
        const mainPath = path.resolve(__dirname, "./../../..");

        exp.use(helmet());
        exp.use(cors());
        exp.use(bodyParser.urlencoded({ extended: false }));
        exp.use(bodyParser.json());
        exp.use(compression());

        Passport.init(exp);

        useContainer(Container);

        exp.use(`${serviceContext}/assets`, express.static(`${mainPath}/assets`));

        useExpressServer(exp, {
            authorizationChecker: async (action: Action, roles: string[]): Promise<boolean> => {
                return new Promise<boolean>((resolve, reject) => {
                    const auth = passport.authenticate("jwt", { session: false },
                        (err, user, info) => {
                            if (user)  {
                                action.request.user = user;
                                resolve(true);
                            } else {
                                reject(new AppError(
                                    action.request.headers.authorization ?
                                        CustomErrors.InvalidCredentials : CustomErrors.AuthorizationRequired
                                ));
                            }
                        });
                    auth(action.request, action.response, action.next.bind(undefined));
                });
            },
            controllers: [`${mainPath}/controllers/*{.js,.ts}`],
            defaultErrorHandler: false,
            middlewares: [`${mainPath}/middlewares/*{.js,.ts}`],
            routePrefix: `${serviceContext}/api`
        });

        app.setExpress(exp);

        const httpsConf = config.get<HttpsConfiguration>("https");
        if (httpsConf.enabled === true) {
            const optionsHttps = {
                ca: httpsConf.cert.ca ? fs.readFileSync(httpsConf.cert.ca) : undefined,
                cert: fs.readFileSync(httpsConf.cert.crt),
                key: fs.readFileSync(httpsConf.cert.key)
            };
            app.setHttpsServer(https.createServer(optionsHttps, exp));
        }

        app.setHttpServer(http.createServer(exp));
    }

}
