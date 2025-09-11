import { REGEX, STATUS } from "@config/main.constant";
import Joi from "joi";

export const addSchema = Joi.object({
    name: Joi.string().trim().required().description('Service type name'),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED).description('Status')
})

export const listingSchema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    search: Joi.string().trim().optional().allow('').label("search")
})

export const validateServiceTypeId = Joi.object({
    serviceTypeId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceTypeId')
})

export const updateSchema = Joi.object({
    serviceTypeId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceTypeId'),
    name: Joi.string().trim().required().description('Service type name'),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED).description('Status')
})

export const updateStatusSchema = Joi.object({
    serviceTypeId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceTypeId'),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED).description('Status')
})

export const deleteSchema = Joi.object({
    serviceTypeId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceTypeId')
})
