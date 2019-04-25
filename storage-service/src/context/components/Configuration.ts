import * as config from "config";
import { Service } from "typedi";

/**
 * Configuration Object
 * @class
 * @description Configuration object with get methods
 */
@Service()
export class Configuration {

    private configuration: config.IConfig;

    constructor() {
        this.configuration = config;
        // tslint:disable-next-line:no-console
        console.log("NODE_ENV: " + this.configuration.util.getEnv("NODE_ENV"));
    }

    /**
     * Get configuraiton key
     * @param key
     */
    public get<T>(key: string): T {
        return this.configuration.get<T>(key);
    }

}
