import Joi from "joi";



export const requestResetTokenSchema = Joi.object({
    email: Joi.string().email().required()
});


export const resetEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
});