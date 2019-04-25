import { Container } from "typedi";
import { Application } from "../../Application";
import { Configuration } from "../../components/Configuration";
import { Logger } from "../../components/Logger";
import { SwaggerManager } from "../../components/SwaggerManager";
import { BootPhase } from "../BootPhase";

/**
 * Swagger boot phases
 * @description Expose api doc with swagger
 * @category Boot Phase
 */
export class SwaggerPhase implements BootPhase {

    /**
     * Execute Swagger boot phase
     * @param app
     */
    public async execute(app: Application): Promise<any> {
        const logger = Container.get<Logger>(Logger);
        const config = Container.get<Configuration>(Configuration);

        logger.info("[BOOT] Serving API documentation");

        if (config.get<boolean>("service.exposeApiDoc")) {
            try {
                const result = await SwaggerManager.init(app);
                logger.info("[BOOT] SwaggerPhase " + (result ? "Done" : "Skipped"));
            } catch (err) {
                logger.error(`[BOOT] SwaggerPhase Error: ${err.message}`);
            }
        } else {
            logger.info("[BOOT] SwaggerPhase Skipped");
        }
        return true;
    }
}
