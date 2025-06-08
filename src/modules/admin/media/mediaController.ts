import { MESSAGES } from "@config/main.constant";
import { MEDIA_MESSAGE } from "./mediaConstant";
import { adminMediaDao } from ".";


class AdminMediaController {
    async add(params,tokenData) {
        try {
            params.lastModifiedBy = {
                userId:tokenData.userId, 
                email: tokenData.email,
                adminType: tokenData.userType
            };
            await adminMediaDao.add(params);
            return MEDIA_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("MediaController :: add", error);
            throw error;
        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await adminMediaDao.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("MediaController :: listing", error);
            throw error;

        }
    }

    async searchById(params,tokenData) {
         try {
            const result = await adminMediaDao.searchById(params);
            if (!result) {
                return Promise.reject(MEDIA_MESSAGE.ERROR.MEDIA_NOT_FOUND);
            }
            else {
                return MEDIA_MESSAGE.SUCCESS.GET_MEDIA(result);
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
            await adminMediaDao.updateById(params);
            return MEDIA_MESSAGE.SUCCESS.UPDATE_MEDIA;
        } catch (error) {
            console.error("MediaController :: update", error);
            throw error;
        }
    }
}
export const adminMediaController = new AdminMediaController();