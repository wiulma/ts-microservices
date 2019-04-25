import * as express from "express";
import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { AppError, AppErrorMap, CustomErrors } from "../context/components/AppErrors";
import { Logger } from "../context/components/Logger";

@Service()
@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    constructor(private logger: Logger) {
    }

    /**
     * Error middleware
     * @param error [[AppError]]
     * @param request
     * @param response
     * @param next
     */
    public error(error: AppError, request: express.Request, response: express.Response,
                 next: (error?: Error) => void) {
        this.logger.warn(`Http request error: ${error || ""}`);
        if (error) {
            const { message, details } = error;
            const { httpStatus, ...respError }: any = AppErrorMap.has(message) ?
                { ...AppErrorMap.get(message), details } : { httpStatus: 500, message, details };

            response.status(httpStatus)
                .json(respError);
        }
        next(error);
    }
}
