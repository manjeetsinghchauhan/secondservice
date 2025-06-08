import { HTTP_STATUS_CODE } from "@config/main.constant";

export const BRAND_MESSAGE = {
	ERROR: {
		BRAND_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "BRAND_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_BRAND: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_BRAND",
				"data": data
			}
		},
		UPDATE_BRAND: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_BRAND",
				"data": data
			}
		},
		DELETE_BRAND: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "DELETE_BRAND",
				"data": data
			}
		},
	}
};