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

export const joiStringInteger = () => Joi.string().custom((value, helper)=>{
    if(!value){
        return value
    }
    const num = Number(value);
    if(!isNaN(num) && num%1===0){
        return value;
    }else{
        return helper.error('api.number.int')
    }
}).messages({
    'api.number.int': '{{#label}} must be an integer number'
})