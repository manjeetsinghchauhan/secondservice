import { MESSAGES } from "@config/main.constant";
import { SERVICE_TYPE_MESSAGE } from "./serviceTypeConstant";
import { adminServiceTypeDao } from "./serviceTypeDao";

class AdminServiceTypeController {
    async add(params,tokenData) {
        try {
            // Check if service type name already exists
            const existingServiceType = await adminServiceTypeDao.checkNameExists(params.name);
            if (existingServiceType) {
                return Promise.reject(SERVICE_TYPE_MESSAGE.ERROR.SERVICE_TYPE_ALREADY_EXISTS);
            }

            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
              };
            await adminServiceTypeDao.add(params);
            return SERVICE_TYPE_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("ServiceTypeController :: add", error);
            throw error;
        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminServiceTypeDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("ServiceTypeController :: listing", error);
            throw error;
        }
    }

    async searchById(params,tokenData) {
         try {
            const result = await adminServiceTypeDao.searchById(params);
            if (!result) {
                return Promise.reject(SERVICE_TYPE_MESSAGE.ERROR.SERVICE_TYPE_NOT_FOUND);
            }
            else {
                return SERVICE_TYPE_MESSAGE.SUCCESS.GET_SERVICE_TYPE(result);
            }
        } catch (error) {
            throw error;
        }
    }

    async updateById(params,tokenData) {
        try {
            // Check if service type name already exists (excluding current record)
            const existingServiceType = await adminServiceTypeDao.checkNameExists(params.name, params.serviceTypeId);
            if (existingServiceType) {
                return Promise.reject(SERVICE_TYPE_MESSAGE.ERROR.SERVICE_TYPE_ALREADY_EXISTS);
            }

            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminServiceTypeDao.updateById(params);
            return SERVICE_TYPE_MESSAGE.SUCCESS.UPDATE_SERVICE_TYPE;
        } catch (error) {
            console.error("ServiceTypeController :: update", error);
            throw error;
        }
    }

    async updateStatus(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminServiceTypeDao.updateById(params);
            return SERVICE_TYPE_MESSAGE.SUCCESS.UPDATE_SERVICE_TYPE;
        } catch (error) {
            console.error("ServiceTypeController :: updateStatus", error);
            throw error;
        }
    }

    /**
     * @function deleteServiceType
     * @description function to delete service type by id
     * @param params
     * @returns object
     */
    async deleteServiceType(params) {
        try {
        const result = await adminServiceTypeDao.deleteServiceType(params);
        if (!result) {
            return Promise.reject(SERVICE_TYPE_MESSAGE.ERROR.SERVICE_TYPE_NOT_FOUND);
        }
        else {
            return SERVICE_TYPE_MESSAGE.SUCCESS.DELETE_SERVICE_TYPE;
        }
        } catch (error) {
        throw error;
        }
    }
}
export const adminServiceTypeController = new AdminServiceTypeController();
