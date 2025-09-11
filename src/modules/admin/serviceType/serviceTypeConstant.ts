import { HTTP_STATUS_CODE } from "@config/main.constant";

export const SERVICE_TYPE_MESSAGE = {
	ERROR: {
		SERVICE_TYPE_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SERVICE_TYPE_NOT_FOUND"
		},
		SERVICE_TYPE_ALREADY_EXISTS:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SERVICE_TYPE_ALREADY_EXISTS"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_SERVICE_TYPE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_SERVICE_TYPE",
				"data": data
			}
		},
		UPDATE_SERVICE_TYPE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_SERVICE_TYPE",
				"data": data
			}
		},
		DELETE_SERVICE_TYPE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "DELETE_SERVICE_TYPE",
				"data": data
			}
		},
	}
};
