import Joi from "joi";

export const createDataSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("201"),
  type: Joi.string().optional().example("SUCCESS"),
  message: Joi.string().optional()
});

export const sucessDataSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("200"),
    type: Joi.string().optional(),
    message: Joi.string().optional()
  });

  export const appointmentErrorSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("400"),
    type: Joi.string().optional().example("BAD_REQUEST"),
    message: Joi.string().optional()
  });

  export const tokenErrorSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("401"),
    type: Joi.string().optional().example("BAD_TOKEN"),
    message: Joi.string().optional()
  });

  export const appointmentNotFoundSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("404"),
    type: Joi.string().optional().example("NOT_FOUND"),
    message: Joi.string().optional()
  });
 
  export const internalServerSchema = Joi.object({
    statusCode: Joi.number().integer().optional().example("500"),
    type: Joi.string().optional().example("INTERNAL_SERVER_ERROR"),
    message: Joi.string().optional()
  });

 