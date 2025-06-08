import { REGEX,STATUS } from "@config/main.constant";
import Joi from "joi";


export const addSchema = Joi.object({
    name: Joi.string().trim().required(),
    media:Joi.array().optional().items({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).trim().optional().allow('').description('image').label("Image Url"),
        type: Joi.string().trim().required().valid("image","video"),
        key: Joi.string().trim().optional().allow('').label("Key")
      }),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED),
    searchKeywords:Joi.array().optional()
})

export const listingSchema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    search: Joi.string().trim().optional().allow('').label("search")
})

export const validateMediaId = Joi.object({
    mediaId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('mediaId')
})

export const editSchema = Joi.object({
  mediaId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('mediaId'),
  status: Joi.string().trim().optional().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED),
  searchKeywords:Joi.array().optional()
})