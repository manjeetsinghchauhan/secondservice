import { SERVER } from "@config/environment";
import { DEVICE_TYPE, LOGIN_TYPE, REGEX, STATUS, VALIDATION_CRITERIA, VALIDATION_MESSAGE } from "@config/main.constant";
import Joi from "joi";

// Individual schema definitions
const adminSignup = Joi.object({
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

  const login = Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      .regex(REGEX.EMAIL)
      .required().default('test@appinventiv.com'),
    password: Joi.string()
      .trim()
      .default(SERVER.DEFAULT_PASSWORD)
      .required(),
    deviceId: Joi.string().trim().required(),
    deviceToken: Joi.string().trim().required(),
  })

const forgotPassword = Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@appinventiv.com"),
  })

const resetPassword = Joi.object({
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

const profile = Joi.object({
    userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
  })

const updateStatus = Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2 })
      // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .regex(REGEX.EMAIL)
      .required().example("test@gmail.com"),
    status: Joi.string().trim().required().valid(STATUS.BLOCKED, STATUS.UN_BLOCKED)
  })

const verifySignUp = Joi.object({
    userId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    otp: Joi.string().default(SERVER.DEFAULT_OTP).required()
  })

const changePassword = Joi.object({
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

// Centralized validation object
export const adminValidation = {
    adminSignup,
    login,
    forgotPassword,
    resetPassword,
    profile,
    updateStatus,
    verifySignUp,
    changePassword
}

// Individual exports for backward compatibility
export { 
    adminSignup, 
    login, 
    forgotPassword, 
    resetPassword, 
    profile, 
    updateStatus, 
    verifySignUp, 
    changePassword 
}