import { celebrate, Joi } from "celebrate";

export const createOrderSchema = celebrate({
  body: Joi.object()
    .keys({
      landId: Joi.number().required(),
      seedId: Joi.number(),
      fertilizerId: Joi.number(),
    })
    .or("seedId", "fertilizerId") // Ensures exactly one of these is provided
    .required(),
});

export const updateOrderStatusSchema = celebrate({
  body: Joi.object().keys({
    status: Joi.string().valid("APPROVED", "REJECTED").required(),
  }),
});
