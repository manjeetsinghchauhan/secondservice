import { adminServiceDao } from "./serviceDao";
import { SERVICE_MESSAGE } from "./serviceConstant";


class AdminServiceController {
    
    async adminAddService(params,tokenData) {
        try {
            const isExist = await adminServiceDao.isServiceExists(params)
            if (isExist) {
              return SERVICE_MESSAGE.ERROR.SERVICE_ALREADY_EXIST;
            }
            else {
              params.lName = params.name.replace(SERVICE_MESSAGE.REGEX.LNAME_REPLACE, '').split(" ").join("-").toLowerCase() + Date.now();
        
              let service = await adminServiceDao.addService(params);
              
              // now set the data in redis
              adminServiceDao.setServiceInRedis(service);
              //let catObj: any = {};
              // catObj.categoryIds = [step1._id];
              // DiscoverDao.setFilterCategoryDataInRedis(catObj)
            
              return SERVICE_MESSAGE.SUCCESS.ADD_SERVICE(service);
            }
          }
          catch (error) {
            throw error;
          }
    }

    /**
     * @function getAdminServices
     * @description function to get all service list
     * @param AdminCategoriesRequest
     * @returns array
     */
    async getAdminServices(params) {
        try {
        const result = await adminServiceDao.filterAndSearchServices(params)
        return SERVICE_MESSAGE.SUCCESS.GET_SERVICE(result);
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function fetchService
     * @description function to fetch service by id
     * @param params
     * @returns object
     */
    async fetchService(params) {
        try {
        const result = await adminServiceDao.fetchService(params);
        if (!result) {
            return Promise.reject(SERVICE_MESSAGE.ERROR.SERVICE_NOT_FOUND);
        }
        else {
            return SERVICE_MESSAGE.SUCCESS.GET_SERVICE(result);
        }
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function updateServiceById
     * @description function to update service by  serviceId
     * @param AdminServiceRequest
     * @returns array
     */
    async updateServiceById (params, tokenData) {
        try {
                params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminServiceDao.updateService(params);
            return SERVICE_MESSAGE.SUCCESS.SERVICE_UPDATED_SUCCESSFULLY;
        } catch (error) {
            console.error("ServiceController :: update", error);
            throw error;
        }
    }

    /**
     * @function deleteService
     * @description function to delete service by id
     * @param params
     * @returns object
     */
    async deleteService(params) {
        try {
        const result = await adminServiceDao.deleteService(params);
        if (!result) {
            return Promise.reject(SERVICE_MESSAGE.ERROR.SERVICE_NOT_FOUND);
        }
        else {
            return SERVICE_MESSAGE.SUCCESS.DELETE_SERVICE;
        }
        } catch (error) {
        throw error;
        }
    }

}
export const adminServiceController = new AdminServiceController();