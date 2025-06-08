import { REGEX,APPOINTMENT_STATUS } from "@config/main.constant";
import Joi from "joi";


export const addSchema = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    providerId: Joi.string().trim().regex(REGEX.MONGO_ID),
    appointmentDate: Joi.date().example("2015/05/14"),
    appointmentSlot: Joi.string().trim().example("09:30 AM"),
    postalAddress: { 
		addressLine1: Joi.string().trim().example("GF-2, Neelpadam 2"),
        addressLine2: Joi.string().trim().example("Sector 4, Vaishali"),
        landmark: Joi.string().trim().example("OPP Mahagun Metro Mall"),
        city: Joi.number().example("10"),
        pincode: Joi.string().trim().example("201010"),
        state: Joi.number().example("15"),
        country: Joi.number().example("11"),
    },
    notes: Joi.string().trim().example("Please carry your Home Service Id"),
    status: Joi.string().trim().required().valid(APPOINTMENT_STATUS.PENDING)  
})

export const listingSchema = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    status: Joi.string().trim().valid("PENDING", "COMPLETED", "CANCELLED").optional(),
    //sortBy: Joi.string().trim().valid("created", "name").optional().description("Sort by created"),
    //sortOrder: Joi.number().valid(1, -1).optional().description("1 for asc, -1 for desc"),
})

export const editSchema = Joi.object({
    appointmentId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    appointmentDate: Joi.date().example("dd/mm/yyyy"),
    appointmentSlot: Joi.string().trim().example("09:30 AM"),
    notes: Joi.string().trim().example("Please carry your Home Service Id"),  
})

export const cancelSchema = Joi.object({
    appointmentId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
})