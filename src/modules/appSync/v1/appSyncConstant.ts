import { HTTP_STATUS_CODE } from "@config/main.constant";

export const APP_SYNC_MESSAGE = {
	ERROR: {

	},
	SUCCESS: {
		// appSunc specific
		ADD_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.CREATED,
			"type": "ADD_CONTENT"
		},
		DELETE_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DELETE_CONTENT"
		},
		EDIT_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.UPDATED,
			"type": "EDIT_CONTENT"
		},
	}

};
