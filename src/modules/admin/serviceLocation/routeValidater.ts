/**
 * Filename: routeValidater.ts
 * Purpose: Route validation schemas for serviceLocation
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

import { REGEX } from "@config/main.constant";
import Joi from "joi";

// Validation for serviceId parameter
export const validateServiceId = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description("Service ID")
});

// Validation for district name parameter
export const validateDistrictName = Joi.object({
    districtName: Joi.string().trim().required().min(2).max(50).description("District Name"),
    stateName: Joi.string().trim().required().min(2).max(50).description("State Name")
});

// Validation for pagination and search (matching existing pattern)
export const validatePaginationAndSearch = Joi.object({
    pageNo: Joi.number().min(1).required().description("Page Number"),
    limit: Joi.number().min(0).max(500).optional().description("Limit per page"),
    search: Joi.string().trim().optional().description("Search term"),
    isEnabled: Joi.boolean().optional().description("Filter by enabled status"),
    isOverride: Joi.boolean().optional().description("Filter by override status"),
    isPublished: Joi.boolean().optional().description("Filter by published status")
});

// Validation for serviceId query parameter
export const validateServiceIdQuery = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description("Service ID"),
    pageNo: Joi.number().min(1).optional().default(1).description("Page Number"),
    limit: Joi.number().min(0).max(500).optional().description("Limit per page")
});

// Validation for district query parameters
export const validateDistrictQuery = Joi.object({
    districtName: Joi.string().trim().required().min(2).max(50).description("District Name"),
    stateName: Joi.string().trim().required().min(2).max(50).description("State Name"),
    pageNo: Joi.number().min(1).optional().default(1).description("Page Number"),
    limit: Joi.number().min(0).max(500).optional().description("Limit per page")
});

// Validation for creating service location
export const validateCreateServiceLocation = Joi.object({
    serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description("Service ID"),
    districtName: Joi.string().trim().required().min(2).max(50).description("District Name"),
    stateName: Joi.string().trim().required().min(2).max(50).description("State Name"),
    isEnabled: Joi.boolean().optional().default(true).description("Enable/disable status"),
    isOverride: Joi.boolean().optional().default(false).description("Override default service values"),
    
    // Optional district-specific pricing (only used when isOverride = true)
    defaultPrice: Joi.number().min(0).optional().description("Default price for district"),
    salePrice: Joi.number().min(0).optional().description("Sale price for district"),
    
    // Optional district-specific features (only used when isOverride = true)
    bundleBuying: Joi.boolean().optional().description("Bundle buying enabled"),
    bundleDiscount: Joi.number().min(0).max(100).optional().description("Bundle discount percentage"),
    isSubscribable: Joi.boolean().optional().description("Subscription enabled"),
    subscriptionDiscount: Joi.number().min(0).max(100).optional().description("Subscription discount percentage"),
    isRefundable: Joi.boolean().optional().description("Refund enabled"),
    refundPeriod: Joi.number().min(0).optional().description("Refund period in days"),
    dealOfTheDay: Joi.boolean().optional().description("Deal of the day enabled"),
    dealOfTheDayDiscount: Joi.number().min(0).max(100).optional().description("Deal of the day discount percentage"),
    isPublished: Joi.boolean().optional().description("Published status"),
    isFeatured: Joi.boolean().optional().description("Featured status"),
    
    // Pincodes array
    pincodes: Joi.array().items(
        Joi.object({
            pincode: Joi.string().trim().regex(/^[1-9][0-9]{5}$/).required().description("Pincode"),
            officeName: Joi.string().trim().required().min(2).max(100).description("Office Name"),
            isEnabled: Joi.boolean().optional().default(true).description("Pincode enabled status")
        })
    ).min(1).required().description("Array of pincodes"),
    
    // Last modified by information
    lastModifiedBy: Joi.object({
        userId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description("Admin User ID"),
        email: Joi.string().trim().email().required().description("Admin Email"),
        adminType: Joi.string().trim().valid("ADMIN", "SUB_ADMIN").required().description("Admin Type")
    }).required().description("Last modified by information")
});

// Validation for updating service location
export const validateUpdateServiceLocation = Joi.object({
    
    
    // Optional fields that can be updated
    districtName: Joi.string().trim().min(2).max(50).optional().description("District Name"),
    stateName: Joi.string().trim().min(2).max(50).optional().description("State Name"),
    isEnabled: Joi.boolean().optional().description("Enable/disable status"),
    isOverride: Joi.boolean().optional().description("Override default service values"),
    
    // Optional district-specific pricing (only used when isOverride = true)
    defaultPrice: Joi.number().min(0).optional().description("Default price for district"),
    salePrice: Joi.number().min(0).optional().description("Sale price for district"),
    
    // Optional district-specific features (only used when isOverride = true)
    bundleBuying: Joi.boolean().optional().description("Bundle buying enabled"),
    bundleDiscount: Joi.number().min(0).max(100).optional().description("Bundle discount percentage"),
    isSubscribable: Joi.boolean().optional().description("Subscription enabled"),
    subscriptionDiscount: Joi.number().min(0).max(100).optional().description("Subscription discount percentage"),
    isRefundable: Joi.boolean().optional().description("Refund enabled"),
    refundPeriod: Joi.number().min(0).optional().description("Refund period in days"),
    dealOfTheDay: Joi.boolean().optional().description("Deal of the day enabled"),
    dealOfTheDayDiscount: Joi.number().min(0).max(100).optional().description("Deal of the day discount percentage"),
    isPublished: Joi.boolean().optional().description("Published status"),
    isFeatured: Joi.boolean().optional().description("Featured status"),
    
    // Optional pincodes array update
    pincodes: Joi.array().items(
        Joi.object({
            pincode: Joi.string().trim().regex(/^[1-9][0-9]{5}$/).required().description("Pincode"),
            officeName: Joi.string().trim().required().min(2).max(100).description("Office Name"),
            isEnabled: Joi.boolean().optional().default(true).description("Pincode enabled status")
        })
    ).min(1).optional().description("Array of pincodes"),
    
    // Optional last modified by information update
    lastModifiedBy: Joi.object({
        userId: Joi.string().trim().regex(REGEX.MONGO_ID).required().description("Admin User ID"),
        email: Joi.string().trim().email().required().description("Admin Email"),
        adminType: Joi.string().trim().valid("ADMIN", "SUB_ADMIN").required().description("Admin Type")
    }).optional().description("Last modified by information")
});
