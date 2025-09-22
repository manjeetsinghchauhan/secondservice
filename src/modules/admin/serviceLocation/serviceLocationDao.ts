import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import * as config from "@config/index";

export class ServiceLocationDao extends BaseDao {
    public serviceLocationDB: any = config.DB_MODEL_REF.SERVICE_LOCATION

    /**
     * @function createServiceLocation
     * @description Create a new service location configuration
     * @param params
     * @returns object
     */
    async createServiceLocation(params: any) {
        try {
            const serviceLocationData = {
                serviceId: toObjectId(params.serviceId),
                districtName: params.districtName,
                stateName: params.stateName,
                isEnabled: params.isEnabled,
                isOverride: params.isOverride,
                defaultPrice: params.defaultPrice,
                salePrice: params.salePrice,
                bundleBuying: params.bundleBuying,
                bundleDiscount: params.bundleDiscount,
                isSubscribable: params.isSubscribable,
                subscriptionDiscount: params.subscriptionDiscount,
                isRefundable: params.isRefundable,
                refundPeriod: params.refundPeriod,
                dealOfTheDay: params.dealOfTheDay,
                dealOfTheDayDiscount: params.dealOfTheDayDiscount,
                isPublished: params.isPublished,
                isFeatured: params.isFeatured,
                pincodes: params.pincodes,
                lastModifiedBy: params.lastModifiedBy,
                lastModifiedAt: new Date()
            };

            return await this.save(this.serviceLocationDB, serviceLocationData);
        } catch (error) {
            console.error("ServiceLocationDao :: createServiceLocation", error);
            throw error;
        }
    }

    /**
     * @function findServiceLocationByDistrict
     * @description Find service location by service, district and state
     * @param params
     * @returns object
     */
    async findServiceLocationByDistrict(params: any) {
        try {
            const query = {
                serviceId: toObjectId(params.serviceId),
                districtName: { $regex: new RegExp(`^${params.districtName}$`, 'i') },
                stateName: { $regex: new RegExp(`^${params.stateName}$`, 'i') }
            };

            return await this.findOne(this.serviceLocationDB, query);
        } catch (error) {
            console.error("ServiceLocationDao :: findServiceLocationByDistrict", error);
            throw error;
        }
    }

    /**
     * @function updateServiceLocationById
     * @description Update service location by ID
     * @param params
     * @returns object
     */
    async updateServiceLocationById(params: any) {
        try {
            const { serviceLocationId, updateData } = params;
            const query = { _id: toObjectId(serviceLocationId) };
            
            updateData.lastModifiedAt = new Date();
            
            return await this.updateOne(this.serviceLocationDB, query, updateData, {});
        } catch (error) {
            console.error("ServiceLocationDao :: updateServiceLocationById", error);
            throw error;
        }
    }

    /**
     * Helper function to find category and subcategory names from categories table
     */
    private async findCategoryNames(subcategoryIds: string[]) {
        let categoryName = null;
        let subCategoryName = null;

        if (!subcategoryIds || subcategoryIds.length === 0) {
            return { categoryName, subCategoryName };
        }

        // Get the first subcategory ID
        const subcategoryId = subcategoryIds[0];
        
        try {
            // First, get the subcategory details
            const subcategory = await this.findOne("categories", { _id: toObjectId(subcategoryId) }, {}, {});
            
            if (subcategory) {
                subCategoryName = subcategory.title;
                
                // Then get the parent category
                const parentCategory = await this.findOne("categories", { _id: toObjectId(subcategory.parentId) }, {}, {});
                
                if (parentCategory) {
                    categoryName = parentCategory.title;
                }
            }
        } catch (error) {
            console.error("Error finding category names:", error);
        }

        return { categoryName, subCategoryName };
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
                $addFields: {
                    // Conditional pricing based on isOverride
                    finalDefaultPrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$defaultPrice",
                            else: "$serviceData.defaultPrice"
                        }
                    },
                    finalSalePrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$salePrice",
                            else: "$serviceData.salePrice"
                        }
                    },
                    finalBundleBuying: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleBuying",
                            else: "$serviceData.bundleBuying"
                        }
                    },
                    finalBundleDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleDiscount",
                            else: "$serviceData.bundleDiscount"
                        }
                    },
                    finalIsSubscribable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isSubscribable",
                            else: "$serviceData.isSubscribable"
                        }
                    },
                    finalSubscriptionDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$subscriptionDiscount",
                            else: "$serviceData.subscriptionDiscount"
                        }
                    },
                    finalIsRefundable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isRefundable",
                            else: "$serviceData.isRefundable"
                        }
                    },
                    finalRefundPeriod: {
                        $cond: {
                            if: "$isOverride",
                            then: "$refundPeriod",
                            else: "$serviceData.refundPeriod"
                        }
                    },
                    finalDealOfTheDay: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDay",
                            else: "$serviceData.dealOfTheDay"
                        }
                    },
                    finalDealOfTheDayDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDayDiscount",
                            else: "$serviceData.dealOfTheDayDiscount"
                        }
                    },
                    finalIsPublished: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isPublished",
                            else: "$serviceData.isPublished"
                        }
                    },
                    finalIsFeatured: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isFeatured",
                            else: "$serviceData.isFeatured"
                        }
                    }
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    // Use conditional pricing fields
                    defaultPrice: "$finalDefaultPrice",
                    salePrice: "$finalSalePrice",
                    bundleBuying: "$finalBundleBuying",
                    bundleDiscount: "$finalBundleDiscount",
                    isSubscribable: "$finalIsSubscribable",
                    subscriptionDiscount: "$finalSubscriptionDiscount",
                    isRefundable: "$finalIsRefundable",
                    refundPeriod: "$finalRefundPeriod",
                    dealOfTheDay: "$finalDealOfTheDay",
                    dealOfTheDayDiscount: "$finalDealOfTheDayDiscount",
                    isPublished: "$finalIsPublished",
                    isFeatured: "$finalIsFeatured",
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status",
                    serviceType: "$serviceData.type",
                    subcategoryIds: "$serviceData.category"
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
                        { $group: { _id: null, count: { $sum: 1 } } }]
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

        // Process each service location to add category names
        for (let serviceLocation of serviceLocations) {
            const { categoryName, subCategoryName } = await this.findCategoryNames(serviceLocation.subcategoryIds);
            serviceLocation.categoryName = categoryName;
            serviceLocation.subCategoryName = subCategoryName;
            delete serviceLocation.subcategoryIds; // Remove the temporary field
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
                $addFields: {
                    // Conditional pricing based on isOverride
                    finalDefaultPrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$defaultPrice",
                            else: "$serviceData.defaultPrice"
                        }
                    },
                    finalSalePrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$salePrice",
                            else: "$serviceData.salePrice"
                        }
                    },
                    finalBundleBuying: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleBuying",
                            else: "$serviceData.bundleBuying"
                        }
                    },
                    finalBundleDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleDiscount",
                            else: "$serviceData.bundleDiscount"
                        }
                    },
                    finalIsSubscribable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isSubscribable",
                            else: "$serviceData.isSubscribable"
                        }
                    },
                    finalSubscriptionDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$subscriptionDiscount",
                            else: "$serviceData.subscriptionDiscount"
                        }
                    },
                    finalIsRefundable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isRefundable",
                            else: "$serviceData.isRefundable"
                        }
                    },
                    finalRefundPeriod: {
                        $cond: {
                            if: "$isOverride",
                            then: "$refundPeriod",
                            else: "$serviceData.refundPeriod"
                        }
                    },
                    finalDealOfTheDay: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDay",
                            else: "$serviceData.dealOfTheDay"
                        }
                    },
                    finalDealOfTheDayDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDayDiscount",
                            else: "$serviceData.dealOfTheDayDiscount"
                        }
                    },
                    finalIsPublished: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isPublished",
                            else: "$serviceData.isPublished"
                        }
                    },
                    finalIsFeatured: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isFeatured",
                            else: "$serviceData.isFeatured"
                        }
                    }
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    // Use conditional pricing fields
                    defaultPrice: "$finalDefaultPrice",
                    salePrice: "$finalSalePrice",
                    bundleBuying: "$finalBundleBuying",
                    bundleDiscount: "$finalBundleDiscount",
                    isSubscribable: "$finalIsSubscribable",
                    subscriptionDiscount: "$finalSubscriptionDiscount",
                    isRefundable: "$finalIsRefundable",
                    refundPeriod: "$finalRefundPeriod",
                    dealOfTheDay: "$finalDealOfTheDay",
                    dealOfTheDayDiscount: "$finalDealOfTheDayDiscount",
                    isPublished: "$finalIsPublished",
                    isFeatured: "$finalIsFeatured",
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status",
                    serviceType: "$serviceData.type",
                    subcategoryIds: "$serviceData.category"
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
                        { $group: { _id: null, count: { $sum: 1 } } }]
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

        // Process each service location to add category names
        for (let serviceLocation of serviceLocations) {
            const { categoryName, subCategoryName } = await this.findCategoryNames(serviceLocation.subcategoryIds);
            serviceLocation.categoryName = categoryName;
            serviceLocation.subCategoryName = subCategoryName;
            delete serviceLocation.subcategoryIds; // Remove the temporary field
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
                $addFields: {
                    // Conditional pricing based on isOverride
                    finalDefaultPrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$defaultPrice",
                            else: "$serviceData.defaultPrice"
                        }
                    },
                    finalSalePrice: {
                        $cond: {
                            if: "$isOverride",
                            then: "$salePrice",
                            else: "$serviceData.salePrice"
                        }
                    },
                    finalBundleBuying: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleBuying",
                            else: "$serviceData.bundleBuying"
                        }
                    },
                    finalBundleDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$bundleDiscount",
                            else: "$serviceData.bundleDiscount"
                        }
                    },
                    finalIsSubscribable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isSubscribable",
                            else: "$serviceData.isSubscribable"
                        }
                    },
                    finalSubscriptionDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$subscriptionDiscount",
                            else: "$serviceData.subscriptionDiscount"
                        }
                    },
                    finalIsRefundable: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isRefundable",
                            else: "$serviceData.isRefundable"
                        }
                    },
                    finalRefundPeriod: {
                        $cond: {
                            if: "$isOverride",
                            then: "$refundPeriod",
                            else: "$serviceData.refundPeriod"
                        }
                    },
                    finalDealOfTheDay: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDay",
                            else: "$serviceData.dealOfTheDay"
                        }
                    },
                    finalDealOfTheDayDiscount: {
                        $cond: {
                            if: "$isOverride",
                            then: "$dealOfTheDayDiscount",
                            else: "$serviceData.dealOfTheDayDiscount"
                        }
                    },
                    finalIsPublished: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isPublished",
                            else: "$serviceData.isPublished"
                        }
                    },
                    finalIsFeatured: {
                        $cond: {
                            if: "$isOverride",
                            then: "$isFeatured",
                            else: "$serviceData.isFeatured"
                        }
                    }
                }
            },
            {
                $project: {
                    serviceId: 1,
                    districtName: 1,
                    stateName: 1,
                    isEnabled: 1,
                    isOverride: 1,
                    // Use conditional pricing fields
                    defaultPrice: "$finalDefaultPrice",
                    salePrice: "$finalSalePrice",
                    bundleBuying: "$finalBundleBuying",
                    bundleDiscount: "$finalBundleDiscount",
                    isSubscribable: "$finalIsSubscribable",
                    subscriptionDiscount: "$finalSubscriptionDiscount",
                    isRefundable: "$finalIsRefundable",
                    refundPeriod: "$finalRefundPeriod",
                    dealOfTheDay: "$finalDealOfTheDay",
                    dealOfTheDayDiscount: "$finalDealOfTheDayDiscount",
                    isPublished: "$finalIsPublished",
                    isFeatured: "$finalIsFeatured",
                    pincodes: 1,
                    lastModifiedBy: 1,
                    lastModifiedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceName: "$serviceData.name",
                    serviceStatus: "$serviceData.status",
                    serviceType: "$serviceData.type",
                    subcategoryIds: "$serviceData.category"
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
                        { $group: { _id: null, count: { $sum: 1 } } }]
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

        // Process each service location to add category names
        for (let serviceLocation of serviceLocations) {
            const { categoryName, subCategoryName } = await this.findCategoryNames(serviceLocation.subcategoryIds);
            serviceLocation.categoryName = categoryName;
            serviceLocation.subCategoryName = subCategoryName;
            delete serviceLocation.subcategoryIds; // Remove the temporary field
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
