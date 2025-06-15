import { REGEX,STATUS } from "@config/main.constant";
import Joi from "joi";


export const addSchema = Joi.object({
    pincode: Joi.string().trim().required().label("Pincode"),
    officeName: Joi.string().trim().required().label("Office Name"),
    officeType: Joi.string().trim().required().valid('HO', 'SO', 'BO').label("Office Type"),
    deliveryStatus:  Joi.string().trim().required().valid('Delivery', 'Non-Delivery').label("Delivery Status"),
    divisionName: Joi.string().trim().required().label("Division Name"),
    regionName: Joi.string().trim().required().label("Region Name"),
    circleName: Joi.string().trim().required().label("Circle Name"),
    taluk: Joi.string().trim().optional().allow('').label("Taluk"),
    districtName: Joi.string().trim().required().label("District Name"),
    stateName: Joi.string().trim().required().label("State Name")
})
export const updateSchema = Joi.object({
    pincodeId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description('pincodeId'),
    pincode: Joi.string().trim().required().label("Pincode"),
    officeName: Joi.string().trim().required().label("Office Name"),
    officeType: Joi.string().trim().required().valid('HO', 'SO', 'BO').label("Office Type"),
    deliveryStatus:  Joi.string().trim().required().valid('Delivery', 'Non-Delivery').label("Delivery Status"),
    divisionName: Joi.string().trim().required().label("Division Name"),
    regionName: Joi.string().trim().required().label("Region Name"),
    circleName: Joi.string().trim().required().label("Circle Name"),
    taluk: Joi.string().trim().optional().allow('').label("Taluk"),
    districtName: Joi.string().trim().required().label("District Name"),
    stateName: Joi.string().trim().required().label("State Name")
})

export const listingSchema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    pincode: Joi.string().trim().optional().allow('').label("pincode")
})

export const validateByPincode = Joi.object({
    pincode: Joi.string().trim().regex(REGEX.ZIP_CODE).required().description('pincode')
})