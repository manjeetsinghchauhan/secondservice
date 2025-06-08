import Joi from "joi";

export const tokenErrorSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("401"),
  type: Joi.string().optional().example("BAD_TOKEN"),
  message: Joi.string().optional()
});

export const internalServerSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("500"),
  type: Joi.string().optional().example("INTERNAL_SERVER_ERROR"),
  message: Joi.string().optional()
});

export const profileSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("PROFILE"),
  data: Joi.object({
    _id: Joi.string().optional(),
    firstName: Joi.string().optional().example("John"),
    lastName: Joi.string().optional().example("Dao"),
    email: Joi.string().email().optional().example("user@appinventiv.com"),
    status: Joi.string().optional().example("BLOCKED , UNBLOCKED "),
    userType: Joi.string().optional().example("USER"),
    loginType: Joi.string().optional().example("normal")
  }).optional(),
  message: Joi.string().valid('PROFILE').optional()
});

export const userNotFoundSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("USER_NOT_FOUND"),
  message: Joi.string().optional()
});

export const userAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("USER_NOT_FOUND"),
  message: Joi.string().optional()
});
export const userSignupSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("201"),
  type: Joi.string().optional().example("SIGNUP"),
  data: Joi.object({}).optional().example("{ }"),
  message: Joi.string().optional()
});

export const emailNotRegisteredSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EMAIL_NOT_REGISTERED"),
  message: Joi.string().optional()
});
export const userBlockedSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("403"),
  type: Joi.string().optional().example("BLOCKED"),
  message: Joi.string().optional()
});
export const phoneNoAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("MOBILE_NO_ALREADY_EXIST"),
  message: Joi.string().optional()
});

export const sendOtpSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("SEND_OTP"),
  message: Joi.string().optional()
});

export const invalidOtpSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("INVALID_OTP"),
  message: Joi.string().optional()
});

export const verifyOtpSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("VERIFY_OTP"),
  data: Joi.object({
    accessToken: Joi.string().optional(),
    userId: Joi.string().optional().example("5678zs4rfcty7gyubi34567"),
    email: Joi.string().email().optional().example("user@appinventiv.com"),
    userType: Joi.string().optional().example("USER"),
    mobileNo: Joi.string().optional().example("7302682390"),
    profilePicture:Joi.string().optional().example("https://google.com/profile.jpg"),
    encEmail: Joi.string().email().optional().example("3w4e5rf6tgyuhnjmsexrctvybhun5r6tvyubnwer"),
  }).optional(),
  message: Joi.string().optional().example("VERIFY_OTP")
});

export const invalidPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("INCORRECT_PASSWORD"),
  message: Joi.string().optional()
});

export const exceedMaxLoginsSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EXCEED_MAX_LOGINS"),
  message: Joi.string().optional()
});

export const loginSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("LOGIN"),
  data: Joi.object({
    accessToken: Joi.string().optional(),
    userId: Joi.string().optional().example("5678zs4rfcty7gyubi34567"),
    email: Joi.string().email().optional().example("user@appinventiv.com"),
    firstName: Joi.string().optional().example("John"),
    lastName: Joi.string().optional().example("Dao"),
    gender:Joi.string().email().optional().example("MALE"),
    profilePicture:Joi.string().optional().example("https://google.com/profile.jpg"),
    dob:Joi.string().optional().example("02/06/2000"),
    mobileNo: Joi.string().optional().example("7302682390"),
    userType: Joi.string().optional().example("USER"),
  }).optional(),
  message: Joi.string().optional().example("LOGIN")
});

export const resetPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("RESET_PASSWORD"),
  message: Joi.string().optional()
});

export const logoutSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("USER_LOGOUT"),
  message: Joi.string().optional()
});
export const updateStatusSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("UNBLOCK_USER , BLOCK_USER"),
  message: Joi.string().optional()
});

export const emailAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EMAIL_ALREADY_EXIST"),
  message: Joi.string().optional()
});

export const matchOldPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("MATCH_OLD_PASSWORD"),
  message: Joi.string().optional()
});
export const resePasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("RESET_PASSWORD"),
  message: Joi.string().optional()
});
export const eamilRequiredSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("EMAIL_REQUIRED"),
  message: Joi.string().optional()
});