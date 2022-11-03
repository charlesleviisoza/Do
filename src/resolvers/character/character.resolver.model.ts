import Joi from "joi";

export const CharacterResolverModels = {
    create: Joi.object().keys({
        gender: Joi.string().required(),
        image: Joi.string().required(),
        locationId: Joi.number().required(),
        name: Joi.string().required(),
        originId: Joi.number().required(),
        species: Joi.string().required(),
        status: Joi.string().required(),
        type: Joi.string().required(),
    }).required(),
    filters: Joi.object().keys({
        gender: Joi.string().optional(),
        name: Joi.string().optional(),
        species: Joi.string().optional(),
        status: Joi.string().optional(),
        type: Joi.string().optional()
    }).optional()
}