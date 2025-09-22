/**
 * Filename: serviceLocationDao.ts
 * Purpose: Data Access Object for serviceLocation operations
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";
import { toObjectId } from "@utils/appUtils";
import { BaseDao } from "../../baseDao/BaseDao";
import { serviceLocations, IServiceLocation } from "./serviceLocationModel";
import * as config from "@config/index";

export class ServiceLocationDao extends BaseDao {
    public serviceLocationDB: any = config.DB_MODEL_REF.SERVICE_LOCATION;

    /**
     * @function createServiceLocation
     * @description Create a new service location configuration
     * @param params
     * @returns object
     */
    async createServiceLocation(params: any) {
        return await this.save(this.serviceLocationDB, params);
    }

    /**
     * @function findServiceLocationByDistrict
     * @description Find service location by service, district and state
     * @param params
     * @returns object
     */
    async findServiceLocationByDistrict(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            districtName: params.districtName,
            stateName: params.stateName
        };
        return await this.findOne(this.serviceLocationDB, query);
    }

    /**
     * @function findServiceLocationByPincode
     * @description Find service location that contains a specific pincode
     * @param params
     * @returns object
     */
    async findServiceLocationByPincode(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            "pincodes.pincode": params.pincode,
            isEnabled: true
        };
        return await this.findOne(this.serviceLocationDB, query);
    }

    /**
     * @function updateServiceLocation
     * @description Update service location configuration
     * @param params
     * @returns object
     */
    async updateServiceLocationById(params: any) {
        const query = { _id: toObjectId(params.serviceLocationId) };
        return await this.findOneAndUpdate(this.serviceLocationDB, query, params.updateData, { new: true });
    }

    async updateServiceLocation(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            districtName: params.districtName,
            stateName: params.stateName
        };
        return await this.findOneAndUpdate(this.serviceLocationDB, query, params.updateData, { new: true });
    }

    /**
     * @function addPincodeToDistrict
     * @description Add a new pincode to existing district
     * @param params
     * @returns object
     */
    async addPincodeToDistrict(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            districtName: params.districtName,
            stateName: params.stateName
        };
        const update = {
            $push: {
                pincodes: {
                    pincode: params.pincode,
                    officeName: params.officeName,
                    isEnabled: params.isEnabled || true
                }
            }
        };
        return await this.findOneAndUpdate(this.serviceLocationDB, query, update, { new: true });
    }

    /**
     * @function updatePincodeStatus
     * @description Update enable/disable status of a specific pincode
     * @param params
     * @returns object
     */
    async updatePincodeStatus(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            districtName: params.districtName,
            stateName: params.stateName
        };
        const update = {
            $set: {
                "pincodes.$[elem].isEnabled": params.isEnabled
            }
        };
        const options = {
            arrayFilters: [{ "elem.pincode": params.pincode }],
            new: true
        };
        return await this.findOneAndUpdate(this.serviceLocationDB, query, update, options);
    }

    /**
     * @function getAllServiceLocations
     * @description Get all service locations for a service
     * @param params
     * @returns array
     */
    async getAllServiceLocations(params: any) {
        const query = {
            serviceId: params.serviceId
        };
        return await this.find(this.serviceLocationDB, query, {});
    }

    /**
     * @function getEnabledDistricts
     * @description Get all enabled districts for a service
     * @param params
     * @returns array
     */
    async getEnabledDistricts(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            isEnabled: true
        };
        return await this.find(this.serviceLocationDB, query, {});
    }

    /**
     * @function getServiceConfigurationForPincode
     * @description Get complete service configuration for a specific pincode
     * @param params
     * @returns object
     */
    async getServiceConfigurationForPincode(params: any) {
        const pipeline = [
            {
                $match: {
                    serviceId: toObjectId(params.serviceId),
                    "pincodes.pincode": params.pincode,
                    isEnabled: true
                }
            },
            {
                $unwind: "$pincodes"
            },
            {
                $match: {
                    "pincodes.pincode": params.pincode,
                    "pincodes.isEnabled": true
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    defaultPrice: 1,
                    salePrice: 1,
                    bundleBuying: 1,
                    bundleDiscount: 1,
                    isSubscribable: 1,
                    subscriptionDiscount: 1,
                    isRefundable: 1,
                    refundPeriod: 1,
                    dealOfTheDay: 1,
                    dealOfTheDayDiscount: 1,
                    isPublished: 1,
                    isFeatured: 1,
                    pincode: "$pincodes.pincode",
                    officeName: "$pincodes.officeName",
                    pincodeEnabled: "$pincodes.isEnabled"
                }
            }
        ];

        const result = await this.aggregate(this.serviceLocationDB, pipeline, {});
        return result[0] || null;
    }

    /**
     * @function deleteServiceLocation
     * @description Delete service location configuration
     * @param params
     * @returns object
     */
    async deleteServiceLocation(params: any) {
        const query = {
            serviceId: toObjectId(params.serviceId),
            districtName: params.districtName,
            stateName: params.stateName
        };
        return await this.findAndRemove(this.serviceLocationDB, query, {}, {});
    }

    /**
     * @function getAllServiceLocationsWithPagination
     * @description Get all service locations with pagination and search
     * @param params
     * @returns object
     */
    async getAllServiceLocationsWithPagination(params: any) {
        const { pageNo = 1, limit = 10, search, isEnabled, isOverride, isPublished } = params;
        const page = parseInt(pageNo);
        const limitNum = parseInt(limit);

        let query: any = {};

        // Add search functionality
        if (search) {
            query.$or = [
                { districtName: { $regex: search, $options: 'i' } },
                { stateName: { $regex: search, $options: 'i' } },
                { "pincodes.pincode": { $regex: search, $options: 'i' } },
                { "pincodes.officeName": { $regex: search, $options: 'i' } }
            ];
        }

        // Add filters
        if (isEnabled !== undefined) {
            query.isEnabled = isEnabled;
        }
        if (isOverride !== undefined) {
            query.isOverride = isOverride;
        }
        if (isPublished !== undefined) {
            query.isPublished = isPublished;
        }

        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: "services",
                    localField: "serviceId",
                    foreignField: "_id",
                    as: "serviceData"
                }
            },
            {
                $unwind: {
                    path: "$serviceData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    defaultPrice: 1,
                    salePrice: 1,
                    bundleBuying: 1,
                    bundleDiscount: 1,
                    isSubscribable: 1,
                    subscriptionDiscount: 1,
                    isRefundable: 1,
                    refundPeriod: 1,
                    dealOfTheDay: 1,
                    dealOfTheDayDiscount: 1,
                    isPublished: 1,
                    isFeatured: 1,
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status"
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    edges: [
                        { $skip: (page - 1) * limitNum },
                        { $limit: limitNum }
                    ],
                    pageInfo: [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
            }
        ];

        const result = await this.aggregate(this.serviceLocationDB, pipeline, {});
        
        let serviceLocations = [];
        let totalCount = 0;

        if (result[0] && result[0].edges) {
            serviceLocations = result[0].edges;
            totalCount = result[0].pageInfo[0] ? result[0].pageInfo[0].count : 0;
        }

        return {
            totalCount,
            page,
            limit: limitNum,
            serviceLocations
        };
    }

    /**
     * @function getServiceLocationsByServiceIdWithPagination
     * @description Get all service locations for a specific service with pagination
     * @param params
     * @returns object
     */
    async getServiceLocationsByServiceIdWithPagination(params: any) {
        const { serviceId, pageNo = 1, limit = 10 } = params;
        const page = parseInt(pageNo);
        const limitNum = parseInt(limit);

        const query = { serviceId: toObjectId(serviceId) };

        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: "services",
                    localField: "serviceId",
                    foreignField: "_id",
                    as: "serviceData"
                }
            },
            {
                $unwind: {
                    path: "$serviceData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    defaultPrice: 1,
                    salePrice: 1,
                    bundleBuying: 1,
                    bundleDiscount: 1,
                    isSubscribable: 1,
                    subscriptionDiscount: 1,
                    isRefundable: 1,
                    refundPeriod: 1,
                    dealOfTheDay: 1,
                    dealOfTheDayDiscount: 1,
                    isPublished: 1,
                    isFeatured: 1,
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status"
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    edges: [
                        { $skip: (page - 1) * limitNum },
                        { $limit: limitNum }
                    ],
                    pageInfo: [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
            }
        ];

        const result = await this.aggregate(this.serviceLocationDB, pipeline, {});
        
        let serviceLocations = [];
        let totalCount = 0;

        if (result[0] && result[0].edges) {
            serviceLocations = result[0].edges;
            totalCount = result[0].pageInfo[0] ? result[0].pageInfo[0].count : 0;
        }

        return {
            totalCount,
            page,
            limit: limitNum,
            serviceLocations
        };
    }

    /**
     * @function getServiceLocationsByDistrictWithPagination
     * @description Get all service locations for a specific district with pagination
     * @param params
     * @returns object
     */
    async getServiceLocationsByDistrictWithPagination(params: any) {
        const { districtName, stateName, pageNo = 1, limit = 10 } = params;
        const page = parseInt(pageNo);
        const limitNum = parseInt(limit);

        const query = { 
            districtName: { $regex: new RegExp(`^${districtName}$`, 'i') },
            stateName: { $regex: new RegExp(`^${stateName}$`, 'i') }
        };

        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: "services",
                    localField: "serviceId",
                    foreignField: "_id",
                    as: "serviceData"
                }
            },
            {
                $unwind: {
                    path: "$serviceData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    defaultPrice: 1,
                    salePrice: 1,
                    bundleBuying: 1,
                    bundleDiscount: 1,
                    isSubscribable: 1,
                    subscriptionDiscount: 1,
                    isRefundable: 1,
                    refundPeriod: 1,
                    dealOfTheDay: 1,
                    dealOfTheDayDiscount: 1,
                    isPublished: 1,
                    isFeatured: 1,
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status"
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    edges: [
                        { $skip: (page - 1) * limitNum },
                        { $limit: limitNum }
                    ],
                    pageInfo: [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
            }
        ];

        const result = await this.aggregate(this.serviceLocationDB, pipeline, {});
        
        let serviceLocations = [];
        let totalCount = 0;

        if (result[0] && result[0].edges) {
            serviceLocations = result[0].edges;
            totalCount = result[0].pageInfo[0] ? result[0].pageInfo[0].count : 0;
        }

        return {
            totalCount,
            page,
            limit: limitNum,
            serviceLocations
        };
    }
}

export const serviceLocationDao = new ServiceLocationDao();
