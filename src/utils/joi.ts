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