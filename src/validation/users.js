import Joi from "joi";



export const requestResetTokenSchema = Joi.object({
    email: Joi.string().email().required()
});


export const resetPaswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
});