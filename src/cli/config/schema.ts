const Joi = require('@hapi/joi');

// region Joi Schema
const JoiConfigSchema = Joi.object({
  order: Joi.array()
    .min(1)
    .unique()
    .optional(),
  transformations: Joi.object().optional(),
  formatter: Joi.func().optional(),
});
// endregion

module.exports = {
  JoiConfigSchema,
};
