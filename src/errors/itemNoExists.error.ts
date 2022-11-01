import { ApiErrors } from "@enums/errors.enum";
import { ApiError } from "./api.error";

export class ItemNoExistsError extends ApiError {

    constructor(msg: string) {
        super(msg, ApiErrors.ITEM_NO_EXISTS,500);
        Object.setPrototypeOf(this, ItemNoExistsError.prototype);
    }
}