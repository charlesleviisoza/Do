import Joi from "joi";

export const EpisodeResolverModels = {
    create: Joi.object().keys({
        air_date: Joi.string().required(),
        episode: Joi.string().required(),
        name: Joi.string().required()
    }).required(),
    filters: Joi.object().keys({
        episode: Joi.string().optional(),
        name: Joi.string().optional()
    }).optional()
}