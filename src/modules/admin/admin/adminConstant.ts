import { HTTP_STATUS_CODE } from "@config/main.constant";

export const ADMIN_MESSAGE = {
	ERROR: {
		ADMIN_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "ADMIN_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_ADMIN: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_ADMIN",
				"data": data
			}
		},
		UPDATE_ADMIN: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_ADMIN",
				"data": data
			}
		},
		DELETE_ADMIN: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "DELETE_ADMIN",
				"data": data
			}
		},
	}
};