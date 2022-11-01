import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class InvalidPasswordError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.INVALID_PASSWORD,500);
        Object.setPrototypeOf(this, InvalidPasswordError.prototype);
    }
}