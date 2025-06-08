import { DB_MODEL_REF } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


class AppSyncDao extends BaseDao {
    public appSyncsDB: any = DB_MODEL_REF.APP_SYNC;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) {
        try {
            await this.save(this.appSyncsDB, params);
        } catch (error) {
            console.error("AppSyncDao :: add", error);
            throw error;

        }
    }

    /**
     * @description listing appSync data 
     * @param params 
     * @returns 
     */
    async listing(params) {
        try {
            console.log("param ::: ", params)
            let aggPipe: any = []
            let match: any = {}
            let sort: any = {};
            
            match.userId= toObjectId(params.userId);
            if (params.searchKey) {
                match["$or"] = [
                    { "name": { "$regex": new RegExp(params.searchKey, "i") } },
                ];
            }
            aggPipe.push({ $match: match });

            (params.sortBy && params.sortOrder) ? sort = { [params.sortBy]: params.sortOrder } : sort = { "created": -1 };//NOSONAR
            console.log("sort ::: ", sort)
            aggPipe.push({ "$sort": sort });

            if (params.limit && params.pageNo) {
                const [skipStage, limitStage] = this.addSkipLimit(
                    params.limit,
                    params.pageNo,
                );
                aggPipe.push(skipStage, limitStage);
            }

            return await this.fastPaginate(this.appSyncsDB, aggPipe, params.limit, params.pageNo, {}, true);


        } catch (error) {
            console.error("AppSyncDao :: add", error);
            throw error;

        }
    }

    /**
     * @description edit appSync data 
     * @param params 
     */
    async edit(params) {
        try {
            let query: any = {}
            let update: any = {};
            query._id = params.appId;
            delete params.appId;
            update["$set"] = params;
            await this.updateOne(this.appSyncsDB, query, update, { upsert: true });

        } catch (error) {
            console.error("AppSyncDao :: add", error);
            throw error;

        }
    }

    /**
     * @description edit appSync data 
     * @param params 
     */
    async delete(params) {
        try {
            let query: any = {};
            query._id = params.appId;
            await this.deleteOne(this.appSyncsDB, query);
        } catch (error) {
            console.error("AppSyncDao :: add", error);
            throw error;

        }
    }
}

export const appSyncDao = new AppSyncDao();