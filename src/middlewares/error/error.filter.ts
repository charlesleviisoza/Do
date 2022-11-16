import { ApiError } from "@errors/api.error";
import { InternalServerError } from "@errors/internalServer.error";
import { ILoggerService } from "@services/logger";
import * as express from "express";

export const errorFilter = (logger: ILoggerService)=>{
    return (err: Error,req: express.Request, res: express.Response, next: express.NextFunction)=>{
        if (err) {
            if(err instanceof ApiError){
                err.log(logger);
                return res.status(err.getStatus()).json(err.getResponse());
            }
            const genericError = new InternalServerError(err.message);
            genericError.log(logger);
            return res.status(genericError.getStatus()).json(genericError.getResponse());
        }
        next();
    }
}