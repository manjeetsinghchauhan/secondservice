import { HTTP_STATUS_CODE } from "@config/main.constant";

export const PINCODE_MESSAGE = {
	ERROR: {
		PINCODE_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "PINCODE_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_PINCODE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_PINCODE",
				"data": data
			}
		},
		UPDATE_PINCODE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_PINCODE",
				"data": data
			}
		},
	}
};