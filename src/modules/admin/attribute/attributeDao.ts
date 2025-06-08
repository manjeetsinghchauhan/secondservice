import { DB_MODEL_REF, STATUS } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


export class AdminAttributeDao extends BaseDao {
    public attributeDB: any = DB_MODEL_REF.ATTRIBUTE;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) { 
        try {
            await this.save(this.attributeDB, params);
        } catch (error) {
            console.error("AttributeDao :: add", error);
            throw error;

        }
    }

    /**
     * @description listing media data 
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
            return await this.fastPaginate(this.attributeDB, aggPipe, params.limit, params.pageNo, {}, true);

        } catch (error) {
            console.error("AttributeDao :: get", error);
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
        query._id = params.attributeId;
        query.status = { '$eq': STATUS.UN_BLOCKED };
        return await this.findOne(this.attributeDB, query, {}, {});
    }

    /**
   * @function update
   * @description function to update ranks for all super categories
   * @returns array
   */

   async updateById(params) {
    try {
        let query: any = {}
        let update: any = {};
        query._id = params.attributeId;
        delete params.attributeId;
        update["$set"] = params;
        await this.updateOne(this.attributeDB, query, update, {});

    } catch (error) {
        console.error("AttributeDao :: edit", error);
        throw error;

    }
  }
}

export const adminAttributeDao = new AdminAttributeDao();