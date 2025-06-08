import { HTTP_STATUS_CODE } from "@config/main.constant";

export const MESSAGES = {
	ERROR: {
		TOKEN_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "TOKEN_EXPIRED"
		},
		BLOCKED: {
			"statusCode": HTTP_STATUS_CODE.ACCESS_FORBIDDEN,
			"type": "BLOCKED"
		},
		INCORRECT_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "INCORRECT_PASSWORD"
		},
		EMAIL_NOT_REGISTERED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_NOT_REGISTERED"
		},
		EMAIL_ALREADY_EXIST: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_ALREADY_EXIST"
		},
		INVALID_OLD_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_OLD_PASSWORD"
		},
		NEW_CONFIRM_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "NEW_CONFIRM_PASSWORD"
		},
		SAME_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SAME_PASSWORD"
		},
		MATCH_OLD_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "MATCH_OLD_PASSWORD"
		},
		OTP_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "OTP_EXPIRED"
		},
		INVALID_OTP: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_OTP"
		},
		EXCEED_MAX_LOGINS:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EXCEED_MAX_LOGINS"
		},
		EXCEED_OTP_LIMIT:{
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EXCEED_OTP_LIMIT"
		},
		// user specific
		USER_NOT_FOUND: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "USER_NOT_FOUND"
		},
		EMAIL_REQUIRED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_REQUIRED"
		},
		MOBILE_NO_ALREADY_EXIST: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "MOBILE_NO_ALREADY_EXIST"
		},
		
	},
	SUCCESS: {
		SEND_OTP: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "SEND_OTP"
		},
		VERIFY_OTP: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "VERIFY_OTP",
				"data": data
			};
		},
		PROFILE: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "PROFILE",
				"data": data
			};
		},
		RESET_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "RESET_PASSWORD"
		},
		SIGNUP: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.CREATED,
				"type": "SIGNUP",
				"data": data
			};
		},
		VERIFY_ACCOUNT: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.CREATED,
				"type": "VERIFY_ACCOUNT",
				"data": data
			};
		},
		LOGIN: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "LOGIN",
				"data": data
			};
		},
		USER_LOGOUT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "USER_LOGOUT"
		},
		BLOCK_USER: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "BLOCK_USER"
		},
		UNBLOCK_USER: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "UNBLOCK_USER"
		},
	}

};
