import { REGEX, STATUS } from "@config/main.constant";
import Joi from "joi";
import { join } from "path";

  export const validateSearchingFiltering = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).description("serviceId"),
    categoryId: Joi.alternatives().try(
      Joi.array().items(Joi.string().regex(REGEX.MONGO_ID)),
      Joi.string().regex(REGEX.MONGO_ID)
    ).description("categoryId"), 
    brandId: Joi.alternatives().try(
      Joi.array().items(Joi.string().regex(REGEX.MONGO_ID)),
      Joi.string().regex(REGEX.MONGO_ID)
    ).description("brandId"),    
    page: Joi.number().min(0).optional().description("page"),
    limit: Joi.number().min(0).max(500).optional().description("limit"),
    search: Joi.string().trim().optional().description('search'),
    status: Joi.string().valid("BLOCKED", "UN_BLOCKED", "DELETED").optional().description('status'),
    sortBy: Joi.string().valid("name", "createdAt").optional().description('sortBy'),
    sortNo: Joi.number().valid(1, -1).optional().description('sortNo')
})

export const validateServiceId = Joi.object({
  serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceId')
})