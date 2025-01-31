import { celebrate, Joi } from "celebrate";

export const validateNewLandInfo = celebrate({
  body: Joi.object().keys({
    upi: Joi.string().required(),
    landSize: Joi.number().greater(0).required(),
    location: Joi.string(),
  }),
});
