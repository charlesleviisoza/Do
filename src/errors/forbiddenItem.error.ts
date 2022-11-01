import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class ForbiddenItemError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.FORBIDDEN_ITEM,403);
        Object.setPrototypeOf(this, ForbiddenItemError.prototype);
    }
}