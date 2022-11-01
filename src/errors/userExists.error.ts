import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class UserExistsError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.USER_EXISTS,500);
        Object.setPrototypeOf(this, UserExistsError.prototype);
    }
}