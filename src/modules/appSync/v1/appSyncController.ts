import { MESSAGES } from "@config/main.constant";
import { appSyncDaoV1 } from "..";
import { APP_SYNC_MESSAGE } from "./appSyncConstant";


class AppSyncController {
    async add(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            await appSyncDaoV1.add(params);
            return APP_SYNC_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("AppSyncController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await appSyncDaoV1.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("AppSyncController :: listing", error);
            throw error;

        }
    }

    async edit(params,tokenData) {
        try {
            await appSyncDaoV1.edit(params);
            return APP_SYNC_MESSAGE.SUCCESS.EDIT_CONTENT;
        } catch (error) {
            console.error("AppSyncController :: edit", error);
            throw error;

        }
    }

    async delete(params,tokenData) {
        try {
            await appSyncDaoV1.delete(params);
            return APP_SYNC_MESSAGE.SUCCESS.DELETE_CONTENT;
        } catch (error) {
            console.error("AppSyncController :: delete", error);
            throw error;

        }
    }

}
export const appSyncController = new AppSyncController();