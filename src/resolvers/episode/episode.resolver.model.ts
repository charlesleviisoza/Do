import { AttachmentTypes } from "@enums/attachmentTypes.enum";
import Joi from "joi";

export const EpisodeResolverModels = {
    create: Joi.object().keys({
        air_date: Joi.string().required(),
        episode: Joi.string().required(),
        name: Joi.string().required()
    }).required()
}