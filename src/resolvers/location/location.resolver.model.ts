import { AttachmentTypes } from "@enums/attachmentTypes.enum";
import Joi from "joi";

export const LocationResolverModels = {
    create: Joi.object().keys({
        dimension: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required()
    }).required()
}