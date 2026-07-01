import Joi from 'joi';

// region Joi Schema
const JoiConfigSchema = Joi.object({
  order: Joi.array().min(1).unique().optional(),
  transformations: Joi.object().optional(),
  formatter: Joi.function().optional(),
});
// endregion

export default JoiConfigSchema;
