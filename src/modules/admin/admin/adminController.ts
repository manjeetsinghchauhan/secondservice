import { MESSAGES } from "@config/main.constant";
import { ADMIN_MESSAGE } from "./adminConstant";
import { adminDao } from "./adminDao";


class AdminController {
    async add(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
              };
            await adminDao.add(params);
            return ADMIN_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("AdminController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("AdminController :: listing", error);
            throw error;

        }
    }

    async searchById(params,tokenData) {
         try {
            const result = await adminDao.searchById(params);
            if (!result) {
                return Promise.reject(ADMIN_MESSAGE.ERROR.ADMIN_NOT_FOUND);
            }
            else {
                return ADMIN_MESSAGE.SUCCESS.GET_ADMIN(result);
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
            await adminDao.updateById(params);
            return ADMIN_MESSAGE.SUCCESS.UPDATE_ADMIN;
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
    async deleteAdmin(params) {
        try {
        const result = await adminDao.deleteAdmin(params);
        if (!result) {
            return Promise.reject(ADMIN_MESSAGE.ERROR.ADMIN_NOT_FOUND);
        }
        else {
            return ADMIN_MESSAGE.SUCCESS.DELETE_ADMIN;
        }
        } catch (error) {
        throw error;
        }
    }
}
export const adminController = new AdminController();