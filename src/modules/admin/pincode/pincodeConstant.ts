import { HTTP_STATUS_CODE } from "@config/main.constant";

export const PINCODE_MESSAGE = {
	ERROR: {
		PINCODE_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "PINCODE_NOT_FOUND"
		},
		DISTRICTS_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.URL_NOT_FOUND,
			"type": "DISTRICTS_NOT_FOUND"
		},
		PINCODES_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.URL_NOT_FOUND,
			"type": "PINCODES_NOT_FOUND"
		},
		STATES_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.URL_NOT_FOUND,
			"type": "STATES_NOT_FOUND"
		},	},
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
		GET_DISTRICTS_BY_STATE: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_DISTRICTS_BY_STATE",
				"data": data
			}
		},
		GET_PINCODES_BY_STATE_AND_DISTRICT: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_PINCODES_BY_STATE_AND_DISTRICT",
				"data": data
			}
		},
		GET_ALL_STATES: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_ALL_STATES",
				"data": data
			};
		},	}
};
