import Joi from "joi";

export const validateJoi = (joiScheme: Joi.Schema, data: any) => {
    const result = joiScheme.validate(data)
    if(result.error) return {
        valid: false,
        error: result.error
    }

    return {
        valid: true
    }
}