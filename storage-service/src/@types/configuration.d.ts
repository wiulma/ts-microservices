declare type LoggingConfiguration = {
    level?: string;
    useConsoleAppender?: boolean;
    useFileAppender?: boolean;
    logsFolder: string;
    fileName: string;
    maxFiles?: number;
    maxSize?: number;
}

declare type HttpConfiguration = {
    enabled: boolean;
    url: string;
    port?: string;
}

declare type HttpsConfiguration = {
    enabled: boolean;
    url: string;
    port: string;
    cert: CertConfiguration;
}

declare type DatabaseConfiguration = {
    "type": string;
    "host": string;
    "port": number;
    "username": string;
    "password": string;
    "database": string;
    "synchronize": boolean;
    "logging": boolean;
}