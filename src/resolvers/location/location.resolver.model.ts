import Joi from "joi";

export const LocationResolverModels = {
    create: Joi.object().keys({
        dimension: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required()
    }).required(),
    filters: Joi.object().keys({
        dimension: Joi.string().optional(),
        name: Joi.string().optional(),
        type: Joi.string().optional()
    }).optional()
}