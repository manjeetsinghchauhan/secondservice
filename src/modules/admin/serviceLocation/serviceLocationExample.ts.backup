/**
 * Filename: serviceLocationExample.ts
 * Purpose: Example usage of ServiceLocation model
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";

import { serviceLocationDao } from "./serviceLocationDao";
import { serviceLocations } from "./serviceLocationModel";

// Example: Enable service for Mumbai district with default values
export async function enableServiceForDistrictWithDefaults(serviceId: string) {
    const params = {
        serviceId: serviceId,
        districtName: "Mumbai",
        stateName: "Maharashtra",
        isEnabled: true,
        isOverride: false, // Uses default service values
        pincodes: [
            { pincode: "400001", officeName: "Mumbai GPO", isEnabled: true },
            { pincode: "400002", officeName: "Mumbai Central", isEnabled: true },
            { pincode: "400003", officeName: "Mumbai Airport", isEnabled: true },
            { pincode: "400004", officeName: "Mumbai Harbour", isEnabled: true }
        ]
    };
    
    return await serviceLocationDao.createServiceLocation(params);
}

// Example: Enable service for Delhi district with custom values
export async function enableServiceForDistrictWithCustoms(serviceId: string) {
    const params = {
        serviceId: serviceId,
        districtName: "Delhi",
        stateName: "Delhi",
        isEnabled: true,
        isOverride: true, // Uses custom district values
        defaultPrice: 1200,
        salePrice: 900,
        bundleBuying: false,
        bundleDiscount: 0,
        isSubscribable: true,
        subscriptionDiscount: 10,
        isRefundable: false,
        refundPeriod: 0,
        dealOfTheDay: false,
        dealOfTheDayDiscount: 0,
        isPublished: true,
        isFeatured: true,
        pincodes: [
            { pincode: "110001", officeName: "New Delhi GPO", isEnabled: true },
            { pincode: "110002", officeName: "New Delhi Central", isEnabled: true }
        ]
    };
    
    return await serviceLocationDao.createServiceLocation(params);
}

// Example: Disable specific pincodes
export async function disableSpecificPincodes(serviceId: string) {
    const params = {
        serviceId: serviceId,
        districtName: "Mumbai",
        stateName: "Maharashtra",
        pincode: "400001",
        isEnabled: false
    };
    
    return await serviceLocationDao.updatePincodeStatus(params);
}

// Example: Add new pincode to existing district
export async function addPincodeToDistrict(serviceId: string) {
    const params = {
        serviceId: serviceId,
        districtName: "Mumbai",
        stateName: "Maharashtra",
        pincode: "400005",
        officeName: "Mumbai Suburban",
        isEnabled: true
    };
    
    return await serviceLocationDao.addPincodeToDistrict(params);
}

// Example: Get service configuration for a pincode
export async function getServiceConfigForPincode(serviceId: string, pincode: string) {
    const params = {
        serviceId: serviceId,
        pincode: pincode
    };
    
    return await serviceLocationDao.getServiceConfigurationForPincode(params);
}

// Example: Convert district from default to custom values
export async function convertDistrictToCustom(serviceId: string) {
    const updateData = {
        isOverride: true,
        defaultPrice: 1000,
        salePrice: 800,
        bundleBuying: true,
        bundleDiscount: 15,
        isSubscribable: true,
        subscriptionDiscount: 20,
        isRefundable: true,
        refundPeriod: 7,
        dealOfTheDay: true,
        dealOfTheDayDiscount: 25,
        isPublished: true,
        isFeatured: false
    };
    
    const params = {
        serviceId: serviceId,
        districtName: "Mumbai",
        stateName: "Maharashtra",
        updateData: updateData
    };
    
    return await serviceLocationDao.updateServiceLocation(params);
}

// Example: Query all enabled districts for a service
export async function getAllEnabledDistricts(serviceId: string) {
    const params = {
        serviceId: serviceId
    };
    
    return await serviceLocationDao.getEnabledDistricts(params);
}

// Example: Get all service locations
export async function getAllServiceLocations(serviceId: string) {
    const params = {
        serviceId: serviceId
    };
    
    return await serviceLocationDao.getAllServiceLocations(params);
}
