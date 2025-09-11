import { DB_MODEL_REF, STATUS } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export class AdminServiceTypeDao extends BaseDao {
    public serviceTypeDB: any = DB_MODEL_REF.SERVICE_TYPE;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) { 
        try {
            await this.save(this.serviceTypeDB, params);
        } catch (error) {
            console.error("ServiceTypeDao :: add", error);
            throw error;
        }
    }

    /**
     * @description listing service type data 
     * @param params 
     * @returns 
     */
    async listing(params) {
        try {
            let aggPipe: any = []
            let match: any = {}
            let sort: any = {};
            match.status = { '$in': [STATUS.UN_BLOCKED, STATUS.BLOCKED] };

            if (params.search) {
                match.name = { "$regex": params.search, "$options": "i" }
            }

            aggPipe.push({ $match: match });

            sort = { "name": 1 };
            aggPipe.push({ "$sort": sort });

            if (params.limit && params.pageNo) {
                const [skipStage, limitStage] = this.addSkipLimit(
                    params.limit,
                    params.pageNo,
                );
                aggPipe.push(skipStage, limitStage);
            }
            console.log("aggPipe", aggPipe)
            return await this.fastPaginate(this.serviceTypeDB, aggPipe, params.limit, params.pageNo, {}, true);

        } catch (error) {
            console.error("ServiceTypeDao :: get", error);
            throw error;
        }
    }

    /**
     * @description Search By Id 
     * @param params 
     * @returns 
     */
    async searchById(params) {
        let query: any = {};
        query._id = params.serviceTypeId;
        query.status = { '$in': [STATUS.UN_BLOCKED, STATUS.BLOCKED] };
        return await this.findOne(this.serviceTypeDB, query, {}, {});
    }

    /**
   * @function update
   * @description function to update service type
   * @returns array
   */
   async updateById(params) {
    try {
        let query: any = {}
        let update: any = {};
        query._id = params.serviceTypeId;
        delete params.serviceTypeId;
        update["$set"] = params;
        await this.updateOne(this.serviceTypeDB, query, update, {});

    } catch (error) {
        console.error("ServiceTypeDao :: edit", error);
        throw error;
    }
  }

   /**
     * @function deleteServiceType
     * @description function to delete service type
     * @param params
     * @returns object
     */
    async deleteServiceType(params) {
        let query: any = {};
        query._id = params.serviceTypeId;
        query.status = { '$ne': STATUS.DELETED };
        let update = {};
        update["$set"] = {
        status: STATUS.DELETED
        };
        let options = { new: true };
        return await this.findOneAndUpdate(this.serviceTypeDB, query, update, options);
    }

    /**
     * @function checkNameExists
     * @description function to check if service type name already exists
     * @param name
     * @param excludeId
     * @returns boolean
     */
    async checkNameExists(name: string, excludeId?: string) {
        let query: any = {};
        query.name = name;
        query.status = { '$ne': STATUS.DELETED };
        
        if (excludeId) {
            query._id = { '$ne': toObjectId(excludeId) };
        }
        
        return await this.findOne(this.serviceTypeDB, query, {}, {});
    }
}

export const adminServiceTypeDao = new AdminServiceTypeDao();
