import { REGEX, STATUS } from "@config/main.constant";
import Joi from "joi";
import { join } from "path";


export const addSchema = Joi.object({
    name: Joi.string().trim().required().min(3)
    .max(100).description('name'),
    description: Joi.string().trim().required().min(10)
    .max(100).description('description'),
    type: Joi.object().optional().keys({
      _id: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('Type Id'),
      name: Joi.string().trim().required().description('Type value'),
    }),
    category: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Category IDs'),
    brand: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Brand IDs'),
    attribute: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Attribute IDs'),
    averageRatings: Joi.number().optional().label('Average rating'),
    reviewerCount: Joi.number().optional().label('Review count'),
    bundleBuying: Joi.boolean().optional().label('Is bundle buy allow?'),
    bundleDiscount: Joi.number().optional().label('Bundle discount percentage'),
    isSubscribable: Joi.boolean().optional().label('Is subscribable?'),
    subscriptionDiscount: Joi.number().optional().label('Subscription discount percentage'),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED),
    dealOfTheDay: Joi.boolean().optional().label('Is deal of the day?'),
    dealOfTheDayDiscount: Joi.number().optional().label('Deal of the day discount percentage'),
    salePrice: Joi.number().required().label('Sale price'),
    defaultPrice: Joi.number().optional().label('Default price'),
    isRefundable: Joi.boolean().optional().label('Is refundable'),
    refundPeriod: Joi.string().trim().optional(),
    searchKeywords:Joi.array().optional(), 
    isPublished: Joi.boolean().required().label('Is published?'),
    isFeatured: Joi.boolean().required().label('Is feaured?'),
    bookedCount: Joi.number().optional().label('Booked count')
})

export const listingSchema = Joi.object({
    page: Joi.number().min(0).optional().description("page"),
    limit: Joi.number().min(0).max(500).optional().description("limit"),
    search: Joi.string().trim().optional().description('search'),
})

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

export const updateService = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('categoryId'),
    name: Joi.string().trim().required().min(3)
    .max(100).description('name'),
    description: Joi.string().trim().required().min(10)
    .max(100).description('description'),
    type: Joi.object().optional().keys({
      _id: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('Type Id'),
      name: Joi.string().trim().required().description('Type value'),
    }),
    category: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Category IDs'),
    brand: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Brand IDs'),
    attribute: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID).required()).required().label('Attribute IDs'),
    averageRatings: Joi.number().optional().label('Average rating'),
    reviewerCount: Joi.number().optional().label('Review count'),
    bundleBuying: Joi.boolean().optional().label('Is bundle buy allow?'),
    bundleDiscount: Joi.number().optional().label('Bundle discount percentage'),
    isSubscribable: Joi.boolean().optional().label('Is subscribable?'),
    subscriptionDiscount: Joi.number().optional().label('Subscription discount percentage'),
    status: Joi.string().trim().required().valid(STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED),
    dealOfTheDay: Joi.boolean().optional().label('Is deal of the day?'),
    dealOfTheDayDiscount: Joi.number().optional().label('Deal of the day discount percentage'),
    salePrice: Joi.number().required().label('Sale price'),
    defaultPrice: Joi.number().optional().label('Default price'),
    isRefundable: Joi.boolean().optional().label('Is refundable'),
    refundPeriod: Joi.string().trim().optional(),
    searchKeywords:Joi.array().optional(), 
    isPublished: Joi.boolean().required().label('Is published?'),
    isFeatured: Joi.boolean().required().label('Is feaured?'),
    bookedCount: Joi.number().optional().label('Booked count')
  })

export const validateServiceId = Joi.object({
  serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('serviceId')
})