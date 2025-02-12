import { celebrate, Joi } from "celebrate";

const phoneRegex = /^\+250[0-9]{9}$/;

export const signUpSchema = celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string()
      .pattern(phoneRegex)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be (12 digits) in format +250 123 456 789",
      })
      .length(13),
    password: Joi.string().min(8).max(32).required(),
  }),
});

export const loginSchema = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    phoneNumber: Joi.string()
      .pattern(phoneRegex)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be in format +250 123 456 789",
      })
      .length(13),
  }),
});
