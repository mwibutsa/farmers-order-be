import { celebrate, Joi } from "celebrate";

export const createSeedSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    pricePerKg: Joi.number().greater(0).required(),
    kgPerAcre: Joi.number().greater(0).required(),
    compatibleFertilizerIds: Joi.array().items(Joi.number()),
  }),
});
export const updateSeedSchema = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      pricePerKg: Joi.number().greater(0),
      kgPerAcre: Joi.number().greater(0),
    })
    .min(1),
});
