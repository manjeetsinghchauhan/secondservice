import { HTTP_STATUS_CODE } from "@config/main.constant";

export const ATTRIBUTE_MESSAGE = {
	ERROR: {
		ATTRIBUTE_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "ATTRIBUTE_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_ATTRIBUTE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_ATTRIBUTE",
				"data": data
			}
		},
		UPDATE_ATTRIBUTE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_ATTRIBUTE",
				"data": data
			}
		},
	}
};