import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class ForbiddenError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.FORBIDDEN,403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}