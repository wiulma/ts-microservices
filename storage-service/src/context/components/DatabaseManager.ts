import * as path from "path";
import { Container, Service } from "typedi";
import { Connection, createConnection } from "typeorm";
import { Configuration } from "./Configuration";
import { Logger } from "./Logger";

/**
 * Database Manager
 *
 * @class DatabaseManager
 * @description Database manager manage Database connections
 */

@Service()
export class DatabaseManager {

    private connection: Connection;

    /**
     * @method init
     * @description Initialize Database connection
     * @param app
     */
    public init(): Promise<boolean> {
        const logger = Container.get<Logger>(Logger);
        const config = Container.get<Configuration>(Configuration);
        const dbConfig: any = config.get<DatabaseConfiguration>("database");
        return new Promise((resolve, reject) => {
            createConnection(
                {
                    ...dbConfig,
                    entities: [
                        path.resolve(__dirname + "/../../entities/*.js")
                    ],
                    name: "default"
                })
                .then((connection: Connection) => {
                    this.connection = connection;
                    logger.info("Database connected by connection " + this.connection.name);
                    resolve(true);
                }).catch((error: Error) => {
                    logger.error("Database connection failed - " + error.message);
                    resolve(false);
                });

        });
    }

    public getConnection(): Connection {
        return this.connection;
    }
}
