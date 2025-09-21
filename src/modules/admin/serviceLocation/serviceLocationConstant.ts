/**
 * Filename: serviceLocationConstant.ts
 * Purpose: Constants for serviceLocation module
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

import { HTTP_STATUS_CODE } from "@config/main.constant";

export const SERVICE_LOCATION_MESSAGE = {
	ERROR: {
		SERVICE_LOCATION_NOT_FOUND: {
			"statusCode": HTTP_STATUS_CODE.URL_NOT_FOUND,
			"type": "SERVICE_LOCATION_NOT_FOUND"
		},
		SERVICE_LOCATION_ALREADY_EXISTS: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SERVICE_LOCATION_ALREADY_EXISTS"
		},
		INVALID_DISTRICT: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_DISTRICT"
		},
		INVALID_SERVICE_ID: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_SERVICE_ID"
		}
	},
	SUCCESS: {
		GET_SERVICE_LOCATIONS: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_SERVICE_LOCATIONS",
				"data": data
			};
		},
		GET_SERVICE_LOCATION_BY_SERVICE: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_SERVICE_LOCATION_BY_SERVICE",
				"data": data
			};
		},
		UPDATE_SERVICE_LOCATION: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.UPDATED,
				"type": "UPDATE_SERVICE_LOCATION",
				"data": data
			};
		},
		CREATE_SERVICE_LOCATION: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.CREATED,
				"type": "CREATE_SERVICE_LOCATION",
				"data": data
			};
		},
		GET_SERVICE_LOCATION_BY_DISTRICT: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "GET_SERVICE_LOCATION_BY_DISTRICT",
				"data": data
			};
		}
	}
};
