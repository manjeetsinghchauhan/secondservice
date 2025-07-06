import { DB_MODEL_REF, STATUS } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


export class AdminDao extends BaseDao {
    public adminDB: any = DB_MODEL_REF.ADMIN;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) { 
        try {
            await this.save(this.adminDB, params);
        } catch (error) {
            console.error("AdminDao :: add", error);
            throw error;

        }
    }

    /**
     * @description listing admin data 
     * @param params 
     * @returns 
     */
    async listing(params) {
        try {
            let aggPipe: any = []
            let match: any = {}
            let sort: any = {};
            match.status = STATUS.UN_BLOCKED;

            if (params.search) {
                match.searchKeywords = { "$regex": params.search, "$options": "i" }
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
            return await this.fastPaginate(this.adminDB, aggPipe, params.limit, params.pageNo, {}, true);

        } catch (error) {
            console.error("AdminDao :: get", error);
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
        query._id = params.adminId;
        query.status = { '$eq': STATUS.UN_BLOCKED };
        return await this.findOne(this.adminDB, query, {}, {});
    }

    /**
   * @function update
   * @description function to update brand
   * @returns array
   */

   async updateById(params) {
    try {
        let query: any = {}
        let update: any = {};
        query._id = params.adminId;
        delete params.adminId;
        update["$set"] = params;
        await this.updateOne(this.adminDB, query, update, {});

    } catch (error) {
        console.error("BrandDao :: edit", error);
        throw error;

    }
  }

   /**
     * @function deleteAdmin
     * @description function to delete admin
     * @param params
     * @returns object
     */
    async deleteAdmin(params) {
        let query: any = {};
        query._id = params.adminId;
        query.status = { '$ne': STATUS.DELETED };
        let update = {};
        update["$set"] = {
        status: STATUS.DELETED
        };
        let options = { new: true };
        return await this.findOneAndUpdate(this.adminDB, query, update, options);
    }
}

export const adminDao = new AdminDao();