import { REGEX,APPOINTMENT_STATUS } from "@config/main.constant";
import Joi from "joi";


export const addSchema = Joi.object({
    title: Joi.string().trim().required().min(3)
    .max(100).description('title'),
    parentId:  Joi.string().trim().optional().allow('0'),
    image: Joi.object().optional().keys({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).trim().optional().allow('').description('image').label("Image Url"),
        key: Joi.string().trim().optional().allow('').label("Key")
    }),
    icon: Joi.object().optional().keys({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).trim().optional().allow('').description('image').label("Image Icon"),
        key: Joi.string().trim().optional().allow('').label("Key")
    }),
    filters:Joi.array().optional().items({
        _id: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('Filter Id'),
        name:Joi.string().trim().required().min(3)
        .max(100).description('Filter Name').label('Filter Name'),
    }),
    level: Joi.number().optional().label('level') 
})

export const listingSchema = Joi.object({
    page: Joi.number().min(0).optional().description("page"),
    limit: Joi.number().min(0).max(500).optional().description("limit"),
    search: Joi.string().trim().optional().description('search'),
})

export const validateUpdateRanking = Joi.array().items({
    _id: Joi.string().trim().required().regex(REGEX.MONGO_ID).label('Category Id'),
    rank: Joi.number().min(1).max(100).optional().description("rank").label('Categort Rank'),
  }).unique()

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

export const updateCategory = Joi.object({
    categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('categoryId'),
    title: Joi.string().trim().optional().min(3)
      .max(100).description('title'),
    status: Joi.string().valid("blocked", "unblocked").optional().description('status'),
    parentId:  Joi.string().trim().optional().allow('0').regex(REGEX.MONGO_ID).label('Parent Id'),
    Image: Joi.object().optional().keys({
      url: Joi.string().uri({ scheme: ['http', 'https'] }).trim().optional().allow('').description('image').label("Image Url"),
      key: Joi.string().trim().optional().allow('').label("Key")
    }),
    icon: Joi.object().optional().keys({
      url: Joi.string().uri({ scheme: ['http', 'https'] }).trim().optional().allow('').description('image').label("Image Icon"),
      key: Joi.string().trim().optional().allow('').label("Key")
    }),
    filters:Joi.array().optional().items({
      _id: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('Filter Id'),
      name:Joi.string().trim().required().min(3)
      .max(100).description('Filter Name').label('Filter Name'),
    }),
    level: Joi.number().optional().label('level')
  })

export const validateCategoryId = Joi.object({
    categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('categoryId')
  })