declare type LogFormatterOptions = {
    level: string,
    message?: string,
    meta?: any
}

declare type AppErrorType = {
    httpStatus: number;
    message?: string;
    details?: any;
    headers?: any;
}

declare type UserAuth = {
    username: string;
    password?: string;
    role: string;
    token?: string;
}
  
declare type RegisterData = {
    profile: UserModel,
    auth: {
        username: string,
        role: string
    }
}