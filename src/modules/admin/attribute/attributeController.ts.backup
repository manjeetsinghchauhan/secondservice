import { MESSAGES } from "@config/main.constant";
import { ATTRIBUTE_MESSAGE } from "./attributeConstant";
import { adminAttributeDao } from "./attributeDao";


class AdminAttributeController {
    async add(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
              };
            await adminAttributeDao.add(params);
            return ATTRIBUTE_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("AttributeController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminAttributeDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("AttributeController :: listing", error);
            throw error;

        }
    }

    async searchById(params,tokenData) {
         try {
            const result = await adminAttributeDao.searchById(params);
            if (!result) {
                return Promise.reject(ATTRIBUTE_MESSAGE.ERROR.ATTRIBUTE_NOT_FOUND);
            }
            else {
                return ATTRIBUTE_MESSAGE.SUCCESS.GET_ATTRIBUTE(result);
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
            await adminAttributeDao.updateById(params);
            return ATTRIBUTE_MESSAGE.SUCCESS.UPDATE_ATTRIBUTE;
        } catch (error) {
            console.error("AttributeController :: update", error);
            throw error;
        }
    }
}
export const adminAttributeController = new AdminAttributeController();