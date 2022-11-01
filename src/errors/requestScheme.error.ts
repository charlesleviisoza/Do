import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class RequestSchemaError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.REQUEST_SCHEMA_ERROR,400);
        Object.setPrototypeOf(this, RequestSchemaError.prototype);
    }

}