import { HTTP_STATUS_CODE } from "@config/main.constant";

export const CATEGORY_MESSAGE = {
	ERROR: {
		CATEGORY_ALREADY_EXIST:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "CATEGORY_ALREADY_EXISTS"
		},
		CATEGORY_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "CATEGORY_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		ADD_CATEGORY: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.CREATED,
				"type": "ADD_CATEGORY",
				"data": data
			};
		},
		GET_CATEGORY: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_CATEGORY",
				"data": data
			}
			
		},
		EDIT_CATEGORY_RANK: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.UPDATED,
				"type": "EDIT_CATEGORY_RANK",
				"data": data	
			}
		},
		CATEGORY_UPDATED_SUCCESSFULLY: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.UPDATED,
				"type": "CATEGORY_UPDATED_SUCCESSFULLY",
				"data": data	
			}
		},
		DELETE_CATEGORY: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DELETE_CATEGORY"
		}
	},
	REGEX: {
		LNAME_REPLACE: /[`~!@#$%^&*()_|+\-=?;:'"’,.<>\{\}\[\]\\\/]/gi,
	}
};
