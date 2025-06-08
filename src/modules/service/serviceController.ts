import { serviceDao } from "./serviceDao";
import { SERVICE_MESSAGE } from "./serviceConstant";


class ServiceController {
    
    /**
     * @function getServices
     * @description function to get all service list
     * @param AdminCategoriesRequest
     * @returns array
     */
    async getServices(params) {
        try {
        const result = await serviceDao.filterAndSearchServices(params)
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
        const result = await serviceDao.fetchService(params);
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

}
export const serviceController = new ServiceController();