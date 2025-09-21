import { MESSAGES } from "@config/main.constant";
import { PINCODE_MESSAGE } from "./pincodeConstant";
import { adminPincodeDao } from "./pincodeDao";


class AdminPincodeController {
    async add(params,tokenData) {
        try {
            await adminPincodeDao.add(params);
            return PINCODE_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("PincodeController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminPincodeDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("PincodeController :: listing", error);
            throw error;

        }
    }

    async searchByPincode(params,tokenData) {
         try {
            const result = await adminPincodeDao.searchByPincode(params);
            if (!result) {
                return Promise.reject(PINCODE_MESSAGE.ERROR.PINCODE_NOT_FOUND);
            }
            else {
                return PINCODE_MESSAGE.SUCCESS.GET_PINCODE(result);
            }
        } catch (error) {
            throw error;
        }
    }

    async updateByPincode(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminPincodeDao.updateByPincode(params);
            return PINCODE_MESSAGE.SUCCESS.UPDATE_PINCODE ;
        } catch (error) {
            console.error("PincodeController :: update", error);
            throw error;
        }
    }

    async getDistrictsByState(params, tokenData) {
        try {
            const result = await adminPincodeDao.getDistrictsByState(params);
            if (!result || result.length === 0) {
                return Promise.reject(PINCODE_MESSAGE.ERROR.DISTRICTS_NOT_FOUND);
            }
            return PINCODE_MESSAGE.SUCCESS.GET_DISTRICTS_BY_STATE(result);
        } catch (error) {
            console.error("PincodeController :: getDistrictsByState", error);
            throw error;
        }
    }

    async getPincodesByStateAndDistrict(params, tokenData) {
        try {
            const result = await adminPincodeDao.getPincodesByStateAndDistrict(params);
            if (!result || result.length === 0) {
                return Promise.reject(PINCODE_MESSAGE.ERROR.PINCODES_NOT_FOUND);
            }
            return PINCODE_MESSAGE.SUCCESS.GET_PINCODES_BY_STATE_AND_DISTRICT(result);
        } catch (error) {
            console.error("PincodeController :: getPincodesByStateAndDistrict", error);
            throw error;
        }
    }

    /**
     * @function getAllStates
     * @description Get all unique state names with statistics
     * @returns object
     */
    async getAllStates(tokenData: any) {
        try {
            const result = await adminPincodeDao.getAllStates();
            if (!result || result.length === 0) {
                return Promise.reject(PINCODE_MESSAGE.ERROR.STATES_NOT_FOUND);
            }
            return PINCODE_MESSAGE.SUCCESS.GET_ALL_STATES(result);
        } catch (error) {
            console.error("PincodeController :: getAllStates", error);
            throw error;
        }
    }
}
export const adminPincodeController = new AdminPincodeController();
