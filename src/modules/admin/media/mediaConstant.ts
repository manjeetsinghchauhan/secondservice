import { HTTP_STATUS_CODE } from "@config/main.constant";

export const MEDIA_MESSAGE = {
	ERROR: {
		MEDIA_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "MEDIA_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		GET_MEDIA: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_MEDIA",
				"data": data
			}
		},
		UPDATE_MEDIA: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "UPDATE_MEDIA",
				"data": data
			}
		},
	}
};