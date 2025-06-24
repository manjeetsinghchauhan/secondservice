import { SERVER } from "@config/environment";
import { LOGIN_TYPE, REGEX, STATUS, VALIDATION_CRITERIA, VALIDATION_MESSAGE } from "@config/main.constant";
import Joi from "joi";

export const tempSignUp= Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@appinventiv.com"),
    password: Joi.string()
      .trim()
      .regex(REGEX.PASSWORD)
      .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
      .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
      .default(SERVER.DEFAULT_PASSWORD)
      .required()
      .messages({
        "string.pattern.base": VALIDATION_MESSAGE.password.pattern,
        "string.min": VALIDATION_MESSAGE.password.minlength,
        "string.max": VALIDATION_MESSAGE.password.maxlength,
        "string.empty": VALIDATION_MESSAGE.password.required,
        "any.required": VALIDATION_MESSAGE.password.required,
      }),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
  })

export const sendOTP=Joi.object({
    type: Joi.string()
      .trim()
      .valid("EMAIL", "MOBILE")
      .default("EMAIL")
      .optional(),
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      .regex(REGEX.EMAIL)
      .required().example("test@appinventiv.com")
  })

export const verifyOTP= Joi.object({
    type: Joi.string()
      .trim()
      .valid("EMAIL", "MOBILE")
      .default("EMAIL")
      .optional(),
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@appinventiv.com"),
    otp: Joi.string().default(SERVER.DEFAULT_OTP).required(),
    mobileNo: Joi.when("type", {
      is: Joi.valid("MOBILE"),
      then: Joi.string()
        .trim()
        .regex(REGEX.MOBILE_NUMBER)
        .required()
        .messages({
          "string.pattern.base": VALIDATION_MESSAGE.mobileNo.pattern,
        }),
      otherwise: Joi.string()
        .trim()
        .regex(REGEX.MOBILE_NUMBER)
        .optional()
        .messages({
          "string.pattern.base": VALIDATION_MESSAGE.mobileNo.pattern,
        }),
    }),
    deviceId: Joi.when("type", {
      is: Joi.valid("MOBILE"),
      then: Joi.string().trim().required(),
      otherwise: Joi.string().trim().optional(),
    }),
    deviceToken: Joi.when("type", {
      is: Joi.valid("MOBILE"),
      then: Joi.string().trim().required(),
      otherwise: Joi.string().trim().optional(),
    }),
  })
export const login= Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().default('test@appinventiv.com'),
    password: Joi.string()
      .trim()
      .default(SERVER.DEFAULT_PASSWORD)
      .required(),
    deviceId: Joi.string().trim().required(),
    deviceToken: Joi.string().trim().required(),
  })
export const socialSignup=Joi.object({
    name: Joi.string().trim().optional(),
    profilePicture: Joi.string().trim().allow("").optional(),
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      .regex(REGEX.EMAIL)
      .optional()
      .example("test@appinventiv.com"),
    socialId: Joi.string().trim().optional(),
    loginType: Joi.string().valid(
      LOGIN_TYPE.APPLE,
      LOGIN_TYPE.FACEBOOK,
      LOGIN_TYPE.GOOGLE
    ).optional(),
    deviceId: Joi.string().trim().optional(),
    deviceToken: Joi.string().trim().optional(),
  })
export const forgotPassword=Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@appinventiv.com"),
  })

export const resetPassword=Joi.object({
    encryptedToken: Joi.string().trim().required(),
    newPassword: Joi.string()
      .trim()
      .regex(REGEX.PASSWORD)
      .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
      .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
      .default(SERVER.DEFAULT_PASSWORD)
      .required()
      .messages({
        "string.pattern.base": VALIDATION_MESSAGE.password.pattern,
        "string.min": VALIDATION_MESSAGE.password.minlength,
        "string.max": VALIDATION_MESSAGE.password.maxlength,
        "string.empty": VALIDATION_MESSAGE.password.required,
        "any.required": VALIDATION_MESSAGE.password.required,
      }),
    confirmPassword: Joi.string()
      .trim()
      .regex(REGEX.PASSWORD)
      .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
      .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
      .default(SERVER.DEFAULT_PASSWORD)
      .required()
      .messages({
        "string.pattern.base": VALIDATION_MESSAGE.password.pattern,
        "string.min": VALIDATION_MESSAGE.password.minlength,
        "string.max": VALIDATION_MESSAGE.password.maxlength,
        "string.empty": VALIDATION_MESSAGE.password.required,
        "any.required": VALIDATION_MESSAGE.password.required,
      }),
  })
export const profile=Joi.object({
    userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
  })
export const updateStatus=Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@gmail.com"),
    status: Joi.string().trim().required().valid(STATUS.BLOCKED, STATUS.UN_BLOCKED)
  })
export const verifySignUp=Joi.object({
    userId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    otp: Joi.string().default(SERVER.DEFAULT_OTP).required()
  })
export const changePassword=Joi.object({
    oldPassword: Joi.string()
    .trim()
    .regex(REGEX.PASSWORD)
    .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
    .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
    .default(SERVER.DEFAULT_PASSWORD)
    .required()
    .messages({
      "string.pattern.base": VALIDATION_MESSAGE.password.pattern,
      "string.min": VALIDATION_MESSAGE.password.minlength,
      "string.max": VALIDATION_MESSAGE.password.maxlength,
      "string.empty": VALIDATION_MESSAGE.password.required,
      "any.required": VALIDATION_MESSAGE.password.required,
    }),
    newPassword: Joi.string()
    .trim()
    .regex(REGEX.PASSWORD)
    .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
    .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
    .default(SERVER.DEFAULT_PASSWORD)
    .required()
    .messages({
      "string.pattern.base": VALIDATION_MESSAGE.password.pattern,
      "string.min": VALIDATION_MESSAGE.password.minlength,
      "string.max": VALIDATION_MESSAGE.password.maxlength,
      "string.empty": VALIDATION_MESSAGE.password.required,
      "any.required": VALIDATION_MESSAGE.password.required,
    }),

  })