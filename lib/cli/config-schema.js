const Joi = require('@hapi/joi');

// region Joi Schema
const JoiConfigSchema = Joi.object({
  order: Joi.array()
    .min(0)
    .unique(),
  transformations: Joi.object().optional(),
  formatter: Joi.func().optional(),
});
// endregion

module.exports = {
  JoiConfigSchema,
};
