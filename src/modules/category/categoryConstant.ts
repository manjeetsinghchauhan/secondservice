import { HTTP_STATUS_CODE } from "@config/main.constant";

export const CATEGORY_MESSAGE = {
	ERROR: {
		CATEGORY_NOT_FOUND:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "CATEGORY_NOT_FOUND"
		}
	},
	SUCCESS: {
		// appSunc specific
		GET_CATEGORY: (data)=>{
			return{
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_CATEGORY",
				"data": data
			}
			
		}
	},
	REGEX: {
		LNAME_REPLACE: /[`~!@#$%^&*()_|+\-=?;:'"’,.<>\{\}\[\]\\\/]/gi,
	}
};
