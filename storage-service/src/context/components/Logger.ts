import * as fsExtra from "fs-extra";
import * as path from "path";
import { Service } from "typedi";
import * as winston from "winston";
import * as winstonRotateFile from "winston-daily-rotate-file";
import { Configuration } from "./Configuration";

/**
 * Logger
 * @class
 * @name Logger
 * @description Application Logger based on winston
 */
@Service()
export class Logger {

    /**
     * winston logger instance
     * @property
     */
    private logger: winston.Logger;
    private transports: any = [];

    constructor(private config: Configuration) {

        const cfg: winston.LoggerOptions = {};
        const loggingCfg: LoggingConfiguration = this.config.get<LoggingConfiguration>("logger");

        const { createLogger, format } = winston;
        const { combine, timestamp, printf, colorize } = format;

        if (loggingCfg.useConsoleAppender) {
            this.transports.push(new winston.transports.Console({
                format: format.combine(
                    colorize()
                ),
                handleExceptions: true,
                level: loggingCfg.level
            }));
        }

        if (loggingCfg.useFileAppender) {
            const fl: string = path.resolve(loggingCfg.logsFolder);
            fsExtra.ensureDirSync(fl);

            this.transports.push(new winstonRotateFile({
                datePattern: "YYYY-MM-DD",
                filename: path.resolve(loggingCfg.logsFolder, loggingCfg.fileName),
                handleExceptions: true,
                json: false,
                level: loggingCfg.level,
                maxFiles: loggingCfg.maxFiles,
                zippedArchive: true
            }));

        }

        this.logger = createLogger({
            exitOnError: false,
            format: combine(
                timestamp(),
                printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                })
            ),
            transports: this.transports
        });
    }

    /**
     * Print info message
     * @method
     * @param msg input message
     */

    public info(msg: string) {
        this.logger.info(msg);
    }

    /**
     * Print debug message
     * @method
     * @param msg input message
     */
    public debug(msg: string) {
        this.logger.debug(msg);
    }

    public warn(msg: string) {
        this.logger.warn(msg);
    }

    public error(msg: string) {
        this.logger.error(msg);
    }
    /*
      public logFormatter(options: LogFormatterOptions) {
        return `${new Date().toISOString()} ${options.level.toUpperCase()} ` +
            `${options.message ? options.message : ""} ` +
            `${(options.meta && Object.keys(options.meta).length) ?
                ("\n\t" + JSON.stringify(options.meta)) : ""}`;
      }
      */

}
