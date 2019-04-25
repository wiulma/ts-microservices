export enum CustomErrors {
    GenericError = "generic.error",
    InvalidParameters = "invalid.parameters",
    MissingParameters = "MissingParameters",
    InvalidUsername = "invalid.username",
    InvalidPassword = "invalid.password",
    AuthorizationRequired = "authorization.required",
    InvalidCredentials = "invalid.credentials",
    InvalidDirection = "invalid.direction",
    SaveError = "save.error",
    NotFound = "not.found",
    ConflictError = "conflict.error",
    InternalServerError = "internl.server.error"
}

/**
 * Error maps with details [[AppErrorType]]
 */
export const AppErrorMap: Map<string, AppErrorType> = new Map();

/**
 * Generic error
 */
AppErrorMap.set(CustomErrors.GenericError, {
    httpStatus: 500,
    message: CustomErrors.GenericError
});

/**
 * Invalid Parameters error
 */
AppErrorMap.set(CustomErrors.InvalidParameters, {
    httpStatus: 422,
    message: CustomErrors.InvalidParameters
});

/**
 * Missing Parameters error
 */
AppErrorMap.set(CustomErrors.MissingParameters, {
    httpStatus: 404,
    message: CustomErrors.MissingParameters
});

/**
 * Authorization Required error
 */
AppErrorMap.set(CustomErrors.AuthorizationRequired, {
    httpStatus: 401,
    message: CustomErrors.AuthorizationRequired
});

/**
 * InvalidUsername error
 */
AppErrorMap.set(CustomErrors.InvalidUsername, {
    httpStatus: 401,
    message: CustomErrors.InvalidUsername
});

/**
 * InvalidPassword error
 */
AppErrorMap.set(CustomErrors.InvalidPassword, {
    httpStatus: 401,
    message: CustomErrors.InvalidPassword
});

/**
 * InvalidCredentials error
 */
AppErrorMap.set(CustomErrors.InvalidCredentials, {
    httpStatus: 401,
    message: CustomErrors.InvalidCredentials
});

/**
 * InvalidDirection error
 */
AppErrorMap.set(CustomErrors.InvalidDirection, {
    httpStatus: 404,
    message: CustomErrors.InvalidDirection
});

/**
 * SaveError error
 */
AppErrorMap.set(CustomErrors.SaveError, {
    httpStatus: 400,
    message: CustomErrors.SaveError
});

/**
 * Not found error
 */
AppErrorMap.set(CustomErrors.NotFound, {
    httpStatus: 404,
    message: CustomErrors.NotFound
});

/**
 * Conflict error
 */
AppErrorMap.set(CustomErrors.ConflictError, {
    httpStatus: 409,
    message: CustomErrors.ConflictError
});

/**
 * Internal server error
 */
AppErrorMap.set(CustomErrors.InternalServerError, {
    httpStatus: 500,
    message: CustomErrors.InternalServerError
});

/**
 * App Error utility class
 * @class
 *
 */
export class AppError extends Error {

    /**
     * Error details
     */
    public details: any;

    constructor(code: string, details?: any) {
        super(code);
        this.details = details;
    }
}
