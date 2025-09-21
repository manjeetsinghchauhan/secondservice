/**
 * Filename: serviceLocationController.ts
 * Purpose: Controller for serviceLocation operations
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

import { serviceLocationDao } from "./serviceLocationDao";
import { toObjectId } from "@utils/appUtils";
import { SERVICE_LOCATION_MESSAGE } from "./serviceLocationConstant";

class ServiceLocationController {
    
    /**
     * @function createServiceLocation
     * @description Create a new service location configuration
     * @param params
     * @returns object
     */
    async createServiceLocation(params: any) {
        try {
            // Check if service location already exists for this service, district and state
            const existingLocation = await serviceLocationDao.findServiceLocationByDistrict({
                serviceId: params.serviceId,
                districtName: params.districtName,
                stateName: params.stateName
            });

            if (existingLocation) {
                return Promise.reject(SERVICE_LOCATION_MESSAGE.ERROR.SERVICE_LOCATION_ALREADY_EXISTS);
            }

            // Create the service location
            const result = await serviceLocationDao.createServiceLocation(params);
            return SERVICE_LOCATION_MESSAGE.SUCCESS.CREATE_SERVICE_LOCATION(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function updateServiceLocation
     * @description Update an existing service location configuration
     * @param params
     * @returns object
     */
    async updateServiceLocation(params: any) {
        try {
            const { serviceLocationId, ...updateData } = params;
            
            // Check if service location exists
            const existingLocation = await serviceLocationDao.findOne(serviceLocationDao.serviceLocationDB, { _id: toObjectId(serviceLocationId) });
            if (!existingLocation) {
                return Promise.reject(SERVICE_LOCATION_MESSAGE.ERROR.SERVICE_LOCATION_NOT_FOUND);
            }

            // If district or state is being changed, check for duplicates
            if (updateData.districtName || updateData.stateName) {
                const newDistrictName = updateData.districtName || existingLocation.districtName;
                const newStateName = updateData.stateName || existingLocation.stateName;
                
                // Check if another service location exists with the same service, district, and state
                const duplicateCheck = await serviceLocationDao.findServiceLocationByDistrict({
                    serviceId: existingLocation.serviceId,
                    districtName: newDistrictName,
                    stateName: newStateName
                });
                
                // If duplicate exists and it's not the same record we're updating
                if (duplicateCheck && duplicateCheck._id.toString() !== serviceLocationId) {
                    return Promise.reject(SERVICE_LOCATION_MESSAGE.ERROR.SERVICE_LOCATION_ALREADY_EXISTS);
                }
            }

            // Update the service location
            const result = await serviceLocationDao.updateServiceLocationById({
                serviceLocationId: serviceLocationId,
                updateData: updateData
            });
            
            return SERVICE_LOCATION_MESSAGE.SUCCESS.UPDATE_SERVICE_LOCATION(result);
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * @function getAllServiceLocations
     * @description Get all service locations with pagination and search
     * @param params
     * @returns array
     */
    async getAllServiceLocations(params: any) {
        try {
            const result = await serviceLocationDao.getAllServiceLocationsWithPagination(params);
            return SERVICE_LOCATION_MESSAGE.SUCCESS.GET_SERVICE_LOCATIONS(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function getServiceLocationsByServiceId
     * @description Get all service locations for a specific service
     * @param params
     * @returns array
     */
    async getServiceLocationsByServiceId(params: any) {
        try {
            const result = await serviceLocationDao.getServiceLocationsByServiceIdWithPagination(params);
            if (!result || result.serviceLocations.length === 0) {
                return Promise.reject(SERVICE_LOCATION_MESSAGE.ERROR.SERVICE_LOCATION_NOT_FOUND);
            }
            return SERVICE_LOCATION_MESSAGE.SUCCESS.GET_SERVICE_LOCATION_BY_SERVICE(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function getServiceLocationsByDistrict
     * @description Get all service locations for a specific district
     * @param params
     * @returns array
     */
    async getServiceLocationsByDistrict(params: any) {
        try {
            const result = await serviceLocationDao.getServiceLocationsByDistrictWithPagination(params);
            if (!result || result.serviceLocations.length === 0) {
                return Promise.reject(SERVICE_LOCATION_MESSAGE.ERROR.SERVICE_LOCATION_NOT_FOUND);
            }
            return SERVICE_LOCATION_MESSAGE.SUCCESS.GET_SERVICE_LOCATION_BY_DISTRICT(result);
        } catch (error) {
            throw error;
        }
    }
}

export const serviceLocationController = new ServiceLocationController();
