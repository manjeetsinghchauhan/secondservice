import { HTTP_STATUS_CODE } from "@config/main.constant";

export const SERVICE_MESSAGE = {
	ERROR: {
		SERVICE_ALREADY_EXIST:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SERVICE_ALREADY_EXISTS"
		},
		SERVICE_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.URL_NOT_FOUND,
			"type": "SERVICE_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_SERVICE: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.CREATED,
				"type": "ADD_SERVICE",
				"data": data
			};
		},
		GET_SERVICE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_SERVICE",
				"data": data
			}
			
		},
		SERVICE_UPDATED_SUCCESSFULLY: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.UPDATED,
				"type": "SERVICE_UPDATED_SUCCESSFULLY",
				"data": data	
			}
		},
		DELETE_SERVICE: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DELETE_SERVICE"
		}
	},
	REGEX: {
		LNAME_REPLACE: /[`~!@#$%^&*()_|+\-=?;:'"’,.<>\{\}\[\]\\\/]/gi,
	}
};
