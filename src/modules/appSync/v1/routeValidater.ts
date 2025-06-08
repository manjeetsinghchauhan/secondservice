import { REGEX } from "@config/main.constant";
import Joi from "joi";


export const addSchema = Joi.object({
    firstName: Joi.string().trim().example("John"),
    lastName: Joi.string().trim().example("Dao"),
    countryCode: Joi.string().trim().example("1"),
    contactImage: Joi.string().trim().example("contactImage"),
    email: Joi.string().trim().example("John@yopmail.com"),
    mobileNo: Joi.string().trim().example("8989898989"),

})

export const listingSchema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    searchKey: Joi.string().allow("").optional().description("Search by name, email ,mobileNo"),
    sortBy: Joi.string().trim().valid("created", "name").optional().description("Sort by created"),
    sortOrder: Joi.number().valid(1, -1).optional().description("1 for asc, -1 for desc"),
})

export const editSchema = Joi.object({
    appId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    name: Joi.string().trim().example("John Doe"),
    email: Joi.string().trim().example("John@yopmail.com"),
    mobileNo: Joi.string().trim().example("8989898989"),
})

export const deleteSchema = Joi.object({
    appId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
})