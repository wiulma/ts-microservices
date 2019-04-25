import * as express from "express";
import * as path from "path";
import { Container } from "typedi";
import { Application } from "../Application";
import { Configuration } from "./Configuration";

/**
 * Swagger Manager
 *
 * @class SwaggerManager
 * @description Swagger manager manage swagger ui and api doc express route
 */

export const SwaggerManager  = {

    /**
     * @method init
     * @description Initialize swagger api
     * @param app
     */
    init(app: Application): Promise<boolean> {
        const config = Container.get<Configuration>(Configuration);
        const exp: express.Express = app.getExpress();
        const fgResolve: boolean = config.get<boolean>("service.exposeApiDoc");
        if (fgResolve) {
            const scc = config.get<string>("service.context");
            const serviceContext = (scc === "") ? "" : `/${scc}`;
            exp.use(`${serviceContext}/apidoc`, express.static(path.resolve(__dirname, "../../../swagger/ui")));
            exp.use(`${serviceContext}/apidef`, express.static(path.resolve(__dirname, "../../../swagger/public")));
        }
        return Promise.resolve(fgResolve);
    }
};
