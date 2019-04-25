import * as appBoot from "app-boot";
import * as express from "express";
import * as http from "http";
import * as https from "https";
import { Service } from "typedi";
import { BootPhase } from "./boot/BootPhase";
import { Configuration } from "./components/Configuration";
import { Logger } from "./components/Logger";

import { AddressInfo } from "net";

/**
 * Application
 * @class
 * @description Application class, with bootstrap phase
 */
@Service()
export class Application {

    private bootable: (obj: any) => void;
    private boot: any;
    private httpsServer!: https.Server;
    private httpServer!: http.Server;
    private exp!: express.Express;
    private closeListeners: Array<() => {}> = [];

    constructor(
        private logger: Logger,
        private config: Configuration) {
        this.bootable = appBoot;
        global.Promise = Promise;
    }

    /**
     * @method bootstrap
     * Application bootstrap by provided boot phases
     * @param bootPhases Promise[]
     */
    public bootstrap(bootPhases: BootPhase[]): Promise<any> {
        const self = this;
        this.logger.info("[BOOT] Boot application started...");
        return new Promise<void>((resolve, reject) => {
            this.boot = this.bootable(this);

            bootPhases.forEach(async (phase) => {
                this.boot.phase(async (app: Application, next: (error?: Error) => void) => {
                    await phase.execute(app);
                    next();
                });
            });

            // start http server
            this.boot.phase((app: Application, next: (error?: Error) => void) => {
                const httpConf = this.config.get<HttpConfiguration>("http");
                this.httpServer.listen({
                    port: this.config.get<number>("http.port")
                },
                    function(this: http.Server, error: Error) {
                        if (error) {
                            self.logger.error(`[BOOT] HttpServerPhase: Error: ${error.message}`);
                            return next(error);
                        }
                        const port = (this.address() as AddressInfo).port;
                        self.logger.info(`[BOOT] HttpServerPhase: REST server is listening on port ${port}`);

                        self.closeListeners.push(
                            (() => {
                                return new Promise((res, rej) => {
                                    self.httpServer.close(() => {
                                        self.logger.info("Closed out http server");
                                        res(true);
                                    });
                                });
                            })
                        );
                        next();
                    });
            });

            // check if boot ends successfully
            this.boot((error: Error) => {
                if (error) {
                    this.logger.error(`[BOOT] Error during application bootstrap: ${error.stack || error.message || ""}`);
                    reject(error);
                } else {
                    this.logger.info("[BOOT] Boot application done!");
                    process.stdin.resume();
                    process.on("SIGTERM", () => this.close().then(() => process.exit(0)));
                    process.on("SIGINT", () => this.close().then(() => process.exit(0)));
                    resolve();
                }
            });

        });
    }

    public close(): Promise<any> {

        return Promise.all(this.closeListeners.map(
            (fn) => {
                return fn();
            }
        ));
    }

    public registerCloseListener(fn: () => {}) {
        this.closeListeners.push(fn);
    }

    /**
     * Set global https server instance
     * @param httpsServer
     */
    public setHttpsServer(httpsServer: https.Server) {
        this.httpsServer = httpsServer;
    }

    /**
     * Set global http server instance
     * @param httpServer
     */
    public setHttpServer(httpServer: http.Server) {
        this.httpServer = httpServer;
    }

    /**
     * Get global https server instance
     * @param httpsServer
     */
    public getHttpsServer(): https.Server {
        return this.httpsServer;
    }

    /**
     * Get global Express instance
     * @param httpsServer
     */
    public getExpress(): express.Express {
        return this.exp;
    }

    /**
     * Set global Express instance
     * @param httpsServer
     */
    public setExpress(e: express.Express) {
        this.exp = e;
    }

}
