import { DB_MODEL_REF, STATUS } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


interface StateAggregationResult {
    stateName: string;
    districts: string[];
    pincodeCount: number;
}

interface StateMapEntry {
    stateName: string;
    districts: string[];
    pincodeCount: number;
}

interface StateResult {
    stateName: string;
    districtCount: number;
    pincodeCount: number;
}

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
     * @description listing pincode data 
     * @param params 
     * @returns 
     */
    async listing(params) {
        try {
            let aggPipe: any = []
            let match: any = {}
            let sort: any = {};

            if (params.search) {
                match.$or = [
                    { pincode: { "$regex": params.search, "$options": "i" } },
                    { districtName: { "$regex": params.search, "$options": "i" } },
                    { stateName: { "$regex": params.search, "$options": "i" } }
                ];
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

    /**
     * @description Get districts by state name
     * @param params { stateName: string }
     * @returns array of unique districts
     */
    async getDistrictsByState(params: { stateName: string }) {
        try {
            const pipeline = [
                {
                    $match: {
                        stateName: { $regex: new RegExp(`^${params.stateName.trim()}`, 'i') }
                    }
                },
                {
                    $group: {
                        _id: "$districtName",
                        districtName: { "$first": "$districtName" },
                        stateName: { "$first": "$stateName" },
                        count: { "$sum": 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        districtName: 1,
                        stateName: 1,
                        pincodeCount: "$count"
                    }
                },
                {
                    $sort: { districtName: 1 }
                }
            ];

            return await this.aggregate(this.pincodeDB, pipeline, { allowDiskUse: true });
        } catch (error) {
            console.error("PincodeDao :: getDistrictsByState", error);
            throw error;
        }
    }

    /**
     * @description Get pincodes and office names by state and district name
     * @param params { stateName: string, districtName: string }
     * @returns array of pincodes and office names
     */
    async getPincodesByStateAndDistrict(params: { stateName: string, districtName: string }) {
        try {
            const pipeline = [
                {
                    $match: {
                        stateName: { $regex: new RegExp(`^${params.stateName.trim()}`, "i") },
                        districtName: { $regex: new RegExp(`^${params.districtName.trim()}`, "i") },
                        deliveryStatus: "Delivery"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        pincode: 1,
                        officeName: 1,
                        districtName: 1,
                        stateName: 1,
                        officeType: 1,
                        deliveryStatus: 1
                    }
                },
                {
                    $sort: { pincode: 1 }
                }
            ];

            return await this.aggregate(this.pincodeDB, pipeline, { allowDiskUse: true });
        } catch (error) {
            console.error("PincodeDao :: getPincodesByStateAndDistrict", error);
            throw error;
        }
    }

    /**
     * @description Get all unique state names with district and pincode counts
     * @returns array of unique states
     */
    async getAllStates(): Promise<StateResult[]> {
        try {
            // Get all unique state names with their raw data
            const pipeline = [
                {
                    $group: {
                        _id: "$stateName",
                        stateName: { "$first": "$stateName" },
                        districts: { "$addToSet": "$districtName" },
                        pincodeCount: { "$sum": 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        stateName: 1,
                        districts: 1,
                        pincodeCount: 1
                    }
                }
            ];

            const result: StateAggregationResult[] = await this.aggregate(this.pincodeDB, pipeline, { allowDiskUse: true });
            
            // Process the results to trim whitespace and merge duplicates using JavaScript
            const stateMap: Record<string, StateMapEntry> = {};
            
            result.forEach((item: StateAggregationResult) => {
                // Trim the state name - use a more explicit approach
                let trimmedStateName = item.stateName;
                while (trimmedStateName.endsWith(' ')) {
                    trimmedStateName = trimmedStateName.slice(0, -1);
                }
                
                if (stateMap[trimmedStateName]) {
                    // Merge with existing state
                    stateMap[trimmedStateName].pincodeCount += item.pincodeCount;
                    // Merge district sets
                    const existingDistricts = new Set(stateMap[trimmedStateName].districts);
                    item.districts.forEach((district: string) => {
                        let trimmedDistrict = district;
                        while (trimmedDistrict.endsWith(' ')) {
                            trimmedDistrict = trimmedDistrict.slice(0, -1);
                        }
                        existingDistricts.add(trimmedDistrict);
                    });
                    stateMap[trimmedStateName].districts = Array.from(existingDistricts);
                } else {
                    // Add new state
                    const trimmedDistricts = item.districts.map((d: string) => {
                        let trimmed = d;
                        while (trimmed.endsWith(' ')) {
                            trimmed = trimmed.slice(0, -1);
                        }
                        return trimmed;
                    });
                    stateMap[trimmedStateName] = {
                        stateName: trimmedStateName,
                        districts: trimmedDistricts,
                        pincodeCount: item.pincodeCount
                    };
                }
            });
            
            // Convert object to array, add districtCount, and sort
            const finalResult: StateResult[] = Object.values(stateMap)
                .map((item: StateMapEntry) => ({
                    stateName: item.stateName, 
                    districtCount: item.districts.length, 
                    pincodeCount: item.pincodeCount 
                }))
                .sort((a, b) => a.stateName.localeCompare(b.stateName));
                
            return finalResult;
                
        } catch (error) {
            console.error("PincodeDao :: getAllStates", error);
            throw error;
        }
    }
}

export const adminPincodeDao = new AdminPincodeDao();
