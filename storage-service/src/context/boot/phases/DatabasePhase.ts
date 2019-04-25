import { Container } from "typedi";
import { Application } from "../../Application";
import { DatabaseManager } from "../../components/DatabaseManager";
import { Logger } from "../../components/Logger";
import { BootPhase } from "../BootPhase";

/**
 * Database boot phases
 * @description Expose api doc with Database
 * @category Boot Phase
 */
export class DatabasePhase implements BootPhase {

    /**
     * Execute Database boot phase
     * @param app
     */
    public async execute(app: Application): Promise<any> {
        const logger = Container.get<Logger>(Logger);
        const dm = Container.get<DatabaseManager>(DatabaseManager);

        logger.info("[BOOT] DatabasePhase init configuration");

        try {
            const result = await dm.init();
            logger.info("[BOOT] DatabasePhase " + (result ? "Done" : "Skipped"));
        } catch (err) {
            logger.error(`[BOOT] DatabasePhase Error: ${err.message}`);
        }
        return true;
    }
}
