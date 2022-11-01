import { ApiErrors } from "@enums/errors.enum";
import { ILoggerService } from "@services/logger";

export class ApiError extends Error{

    private errorId: ApiErrors;
    private statusCode: number;

    constructor(
        msg: string,
        errorId: ApiErrors,
        statusCode: number
    ) {
        super(msg);
        this.errorId = errorId;
        this.statusCode = statusCode;
    }

    log(logger: ILoggerService){
        logger.error(`${this.errorId} ${this.message}`);
    }

    getStatus(){
        return this.statusCode;
    }

    getResponse(){
        return {
            data: {},
            error: this.errorId
        }
    }
}