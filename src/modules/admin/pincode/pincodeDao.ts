import { DB_MODEL_REF, STATUS } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


export class AdminPincodeDao extends BaseDao {
    public pincodeDB: any = DB_MODEL_REF.PINCODE;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) { 
        try {
            await this.save(this.pincodeDB, params);
        } catch (error) {
            console.error("PincodeDao :: add", error);
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

            if (params.pincode) {
                match.pincode = { "$regex": params.pincode, "$options": "i" }
              }

            aggPipe.push({ $match: match });

            sort = { "districtName": 1 };
            aggPipe.push({ "$sort": sort });

            if (params.limit && params.pageNo) {
                const [skipStage, limitStage] = this.addSkipLimit(
                    params.limit,
                    params.pageNo,
                );
                aggPipe.push(skipStage, limitStage);
            }
            console.log("aggPipe", aggPipe)
            return await this.fastPaginate(this.pincodeDB, aggPipe, params.limit, params.pageNo, {}, true);

        } catch (error) {
            console.error("PincodeDao :: get", error);
            throw error;

        }
    }

    /**
     * @description Search By pincode 
     * @param params 
     * @returns 
     */
    async searchByPincode(params) {
        let query: any = {};
        query.pincode = params.pincode;
        return await this.find(this.pincodeDB, query, {}, {});
    }

    /**
   * @function update
   * @description function to update pincode details
   * @returns array
   */

   async updateByPincode(params) {
    try {
        let query: any = {}
        let update: any = {};
        query._id = params.pincodeId;
        delete params.pincodeId;
        update["$set"] = params;
        await this.updateOne(this.pincodeDB, query, update, {});

    } catch (error) {
        console.error("PincodeDao :: edit", error);
        throw error;

    }
  }
}

export const adminPincodeDao = new AdminPincodeDao();