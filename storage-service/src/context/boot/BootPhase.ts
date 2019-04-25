import { Application } from "../Application";

/**
 * @class BootPhase
 * @abstract
 * Abstract Boot Phase
 */

export interface BootPhase {

    /**
     * @method execute
     * @description Execute boot phases
     * @param app Application object
     * @returns Promise
     */
    execute(app: Application): Promise<boolean>;
}
