import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS,  LOGIN_TYPE, DB_MODEL_REF } from "@config/main.constant";
import { logger } from "@lib/logger";

export class AdminDao extends BaseDao {
    public adminDB: any = DB_MODEL_REF.ADMIN;

	/**
	 * @function isEmailExists
	 * @description checks if email or userId exists or not
	 */
	async isEmailExists(params, userId?: string) {
		try {
			const query: any = {};
			query.email = params.email;
			if (userId) query._id = { "$not": { "$eq": userId } };
			query.status = { "$ne": STATUS.DELETED };

			return await this.findOne(this.adminDB, query, {});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}


	/**
	 * @function isMobileExists
	 * @description checks if phoneNumber or userId exists or not
	 */
	async isMobileExists(params, userId?: string) {
		try {
			const query: any = {};
			query.countryCode = params.countryCode;
			query.mobileNo = params.mobileNo;
			if (userId) query._id = { "$not": { "$eq": userId } };
			query.status = { "$ne": STATUS.DELETED };

			const projection = { _id: 1 };

			return await this.findOne(this.adminDB, query, projection);
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	 * @function signUp
	 * @description save new user's data in DB
	 */
	async signUp(params, session?) {
		try {
			return await this.save(this.adminDB, params, { session });
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**    
	 * @function findUserById
	 * @description fetch all details of user on basis of _id (userId)
	 */
	async findUserById(userId: string, project = {}) {
		try {
			const query: any = {};
			query._id = userId;
			query.status = { "$ne": STATUS.DELETED };

			const projection = (Object.values(project).length) ? project : { createdAt: 0, updatedAt: 0 };

			return await this.findOne(this.adminDB, query, projection);
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	 * @function changePassword 
	 * @description update the hash (password) field in user's Document  
	 */
	async changePassword(params: UserRequest.ChangeForgotPassword) {
		try {
			const query: any = {};
			query.email = params.email;

			const update = {};
			update["$set"] = {
				hash: params.hash
			};

			return await this.updateOne(this.adminDB, query, update, {});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}


	/**    
	* @function updateStatus
	* @description update the user status 
	* @returns
	*/
	async updateStatus(params, existingData) {
		try {
			const query: any = {};
			const dataToUpdate: any = {}
			query['_id'] = existingData._id;
			if (params.status) dataToUpdate['status'] = params.status;
		return await this.findOneAndUpdate(this.adminDB, query, dataToUpdate, {new: true});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
	/**    
	* @function changePassword
	* @description changePassword of the user
	* @returns
	*/
	async changePasswords(params,userId) {
		try {
			const query: any = {};
			query["_id"] = userId;

			const update = {};
			update["$set"] = {
				hash: params.hash
			};

			return await this.updateOne(this.adminDB, query, update, {});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

  async login(params: UserRequest.Login) {
    try {
      const admin = await this.findOne(this.adminDB, params, {});
      return admin;
    } catch (error) {
      throw error;
    }
  }
}

export const adminDao = new AdminDao();