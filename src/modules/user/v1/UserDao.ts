import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS,  LOGIN_TYPE } from "@config/main.constant";
import { logger } from "@lib/logger";

export class UserDao extends BaseDao {

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

			const projection = { updatedAt: 0 };

			return await this.findOne("users", query, projection);
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	 * @function isEmailExists
	 * @description checks if email or userId exists or not
	 */
	async isTmpEmailExists(params, userId?: string) {
		try {
			const query: any = {};
			query.email = params.email;
			if (userId) query._id = { "$not": { "$eq": userId } };
			query.status = { "$ne": STATUS.DELETED };

			const projection = { updatedAt: 0 };

			return await this.findOne("pre_signup", query, projection);
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

			return await this.findOne("users", query, projection);
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
			return await this.save("users", params, { session });
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	 * @function tempSignUp
	 * @description save new user's data in DB
	 */
	async tempSignUp(params, session?) {
		try {
			return await this.save("pre_signup", params, { session });
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

			return await this.findOne("users", query, projection);
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

			return await this.updateOne("users", query, update, {});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}


	/**    
	* @function updateSocialData
	* @description update the user data if user re-login with some social accounts
	* @returns
	*/
	async updateSocialData(params, existingData) {
		try {
			const query: any = {};
			query['_id'] = existingData._id;
			if (params.name) params['socialData.name'] = params.name;
			if (params.profilePicture) params['socialData.profilePic'] = params.profilePicture;
			params['socialData.socialId'] = params.socialId;
			if(params.email)params['socialData.email'] = params.email;
			if(params.loginType==LOGIN_TYPE.APPLE) params['appleSocialId'] = params.socialId;
			if(params.loginType==LOGIN_TYPE.GOOGLE) params['googleSocialId'] = params.socialId;
		return await this.findOneAndUpdate("users", query, params, {new: true});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	* @function isUserExists
	* @description checks if the user is already exists
	* @returns return user's data
	*/
	async isSocialIdExists(params, userId?: string) {
		try {
			const query: any = {};
			if(params.loginType==LOGIN_TYPE.APPLE) query['appleSocialId'] = params.socialId;
			if(params.loginType==LOGIN_TYPE.GOOGLE) query['googleSocialId'] = params.socialId;
			query['socialData.socialId'] = params.socialId;
			if (userId) query._id = { "$not": { "$eq": userId } };
			query.status = { "$ne": STATUS.DELETED };
			const projection = { updatedAt: 0 };
			return await this.findOne("users", query, projection);
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
		return await this.findOneAndUpdate("users", query, dataToUpdate, {new: true});
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

			return await this.updateOne("users", query, update, {});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

}

export const userDao = new UserDao();