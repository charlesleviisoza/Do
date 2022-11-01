import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class UserNoExistsError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.USER_NO_EXISTS,500);
        Object.setPrototypeOf(this, UserNoExistsError.prototype);
    }
}