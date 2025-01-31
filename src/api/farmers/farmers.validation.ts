import { celebrate, Joi } from "celebrate";

export const signUpSchema = celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().min(8).max(32).required(),
  }),
});

export const loginSchema = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }),
});
