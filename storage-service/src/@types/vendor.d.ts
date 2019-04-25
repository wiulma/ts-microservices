declare module "app-boot";
declare module "winston-daily-rotate-file";
declare module "ssl-root-cas";

declare namespace c {
    export interface IConfig {
        [key: string]: any;
    }
}

declare namespace winston {
    interface Winston {
        createLogger(options: LoggerOptions): winston.Logger;
    }    
}
