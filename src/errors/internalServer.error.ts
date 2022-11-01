import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.INTERNAL_SERVER_ERROR,500);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}