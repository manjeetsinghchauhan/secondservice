import { DB_MODEL_REF } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


export class AppointmentDao extends BaseDao {
    public appointmentDB: any = DB_MODEL_REF.APPOINTMENET;

    /**
     * @description add data 
     * @method add 
     */
    async add(params) { 
        try {
            await this.save(this.appointmentDB, params);
        } catch (error) {
            console.error("AppointmentDao :: add", error);
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
            if (params.status) {
                match["$or"] = [
                    { status: params.status },
                ];
            }
            aggPipe.push({ $match: match });

            sort = { "appointmentDate": -1 };
            aggPipe.push({ "$sort": sort });

            if (params.limit && params.pageNo) {
                const [skipStage, limitStage] = this.addSkipLimit(
                    params.limit,
                    params.pageNo,
                );
                aggPipe.push(skipStage, limitStage);
            }
            console.log("aggPipe", aggPipe)
            return await this.fastPaginate(this.appointmentDB, aggPipe, params.limit, params.pageNo, {}, true);

        } catch (error) {
            console.error("AppointmentDao :: get", error);
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
            query._id = params.appointmentId;
            delete params.appointmentId;
            update["$set"] = params;
            await this.updateOne(this.appointmentDB, query, update, { upsert: true });

        } catch (error) {
            console.error("AppointmentDao :: edit", error);
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
            query._id = params.appointmentId;
            await this.deleteOne(this.appointmentDB, query);
        } catch (error) {
            console.error("AppointmentDao :: delete", error);
            throw error;

        }
    }
}

export const appointmentDao = new AppointmentDao();