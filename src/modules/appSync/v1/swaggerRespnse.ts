import Joi from "joi";

export const sucessDataSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("200"),
    type: Joi.string().optional(),
    message: Joi.string().optional()
  });