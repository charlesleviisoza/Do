import Joi from "joi";

export const validateJoi = (joiScheme: Joi.Schema, data: any) => {
    const result = joiScheme.validate(data)
    if(result.error) return {
        error: result.error,
        valid: false
    }

    return {
        valid: true
    }
}

export const paginationValidator = () => Joi.object().keys({
    limit: Joi.number().min(1).required(),
    page: Joi.number().min(1).required()
}).optional()