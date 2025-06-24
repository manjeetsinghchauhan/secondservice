import { REGEX,APPOINTMENT_STATUS } from "@config/main.constant";
import Joi from "joi";

export const listingSchema = Joi.object({
    page: Joi.number().min(0).optional().description("page"),
    limit: Joi.number().min(0).max(500).optional().description("limit"),
    search: Joi.string().trim().optional().description('search'),
})

export const validateSearchingFiltering = Joi.object({
    page: Joi.number().min(0).optional().description("page"),
    limit: Joi.number().min(0).max(500).optional().description("limit"),
    regStartDate: Joi.date().optional().description('regStartDate'),
    regEndDate: Joi.date().optional().description('regEndDate'),
    search: Joi.string().trim().optional().description('search'),
    status: Joi.string().valid("blocked", "unblocked").optional().description('status'),
    sortBy: Joi.string().valid("title", "type", "totalProducts", "createdAt","rank").optional().description('sortBy'),
    sortNo: Joi.number().valid(1, -1).optional().description('sortNo'),
    isParent: Joi.boolean().optional().label('Is Parent'),
    parentId:  Joi.string().trim().optional().allow('').regex(REGEX.MONGO_ID).label('Parent Id'),
    level: Joi.number().optional().label('Category Level')
})

export const validateCategoryId = Joi.object({
    categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('categoryId')
})