import { MESSAGES } from "@config/main.constant";
import { BRAND_MESSAGE } from "./brandConstant";
import { adminBrandDao } from "./brandDao";


class AdminBrandController {
    async add(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
              };
            await adminBrandDao.add(params);
            return BRAND_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("BrandController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminBrandDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("BrandController :: listing", error);
            throw error;

        }
    }

    async searchById(params,tokenData) {
         try {
            const result = await adminBrandDao.searchById(params);
            if (!result) {
                return Promise.reject(BRAND_MESSAGE.ERROR.BRAND_NOT_FOUND);
            }
            else {
                return BRAND_MESSAGE.SUCCESS.GET_BRAND(result);
            }
        } catch (error) {
            throw error;
        }
    }

    async updateById(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminBrandDao.updateById(params);
            return BRAND_MESSAGE.SUCCESS.UPDATE_BRAND;
        } catch (error) {
            console.error("MediaController :: update", error);
            throw error;
        }
    }

    /**
     * @function deleteBrand
     * @description function to delete brand by id
     * @param params
     * @returns object
     */
    async deleteBrand(params) {
        try {
        const result = await adminBrandDao.deleteBrand(params);
        if (!result) {
            return Promise.reject(BRAND_MESSAGE.ERROR.BRAND_NOT_FOUND);
        }
        else {
            return BRAND_MESSAGE.SUCCESS.DELETE_BRAND;
        }
        } catch (error) {
        throw error;
        }
    }
}
export const adminBrandController = new AdminBrandController();