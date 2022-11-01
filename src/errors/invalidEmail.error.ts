import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class InvalidEmailError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.INVALID_EMAIL,500);
        Object.setPrototypeOf(this, InvalidEmailError.prototype);
    }
}