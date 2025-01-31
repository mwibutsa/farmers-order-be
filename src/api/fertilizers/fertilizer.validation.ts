import { celebrate, Joi } from "celebrate";

export const createFertilizerSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    pricePerKg: Joi.number().positive().required(),
    kgPerAcre: Joi.number().positive().required(),
    compatibleSeedIds: Joi.array().items(Joi.number()),
  }),
});

export const updateFertilizerSchema = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      pricePerKg: Joi.number().positive(),
      kgPerAcre: Joi.number().positive(),
      compatibleSeedIds: Joi.array().items(Joi.number()),
    })
    .min(1),
});
