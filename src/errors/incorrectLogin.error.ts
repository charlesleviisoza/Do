import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class IncorrectLoginError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.INCORRECT_LOGIN,500);
        Object.setPrototypeOf(this, IncorrectLoginError.prototype);
    }
}