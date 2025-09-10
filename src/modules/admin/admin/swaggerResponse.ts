import Joi from "joi";

 const tokenErrorSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("401"),
  type: Joi.string().optional().example("BAD_TOKEN"),
  message: Joi.string().optional()
});

 const internalServerSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("500"),
  type: Joi.string().optional().example("INTERNAL_SERVER_ERROR"),
  message: Joi.string().optional()
});

 const profileSchema = Joi.object({
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

 const userNotFoundSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("USER_NOT_FOUND"),
  message: Joi.string().optional()
});

 const userAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("USER_NOT_FOUND"),
  message: Joi.string().optional()
});
 const userSignupSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("201"),
  type: Joi.string().optional().example("SIGNUP"),
  data: Joi.object({}).optional().example("{ }"),
  message: Joi.string().optional()
});

 const emailNotRegisteredSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EMAIL_NOT_REGISTERED"),
  message: Joi.string().optional()
});
 const userBlockedSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("403"),
  type: Joi.string().optional().example("BLOCKED"),
  message: Joi.string().optional()
});
 const phoneNoAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("MOBILE_NO_ALREADY_EXIST"),
  message: Joi.string().optional()
});

 const invalidPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("INCORRECT_PASSWORD"),
  message: Joi.string().optional()
});

 const exceedMaxLoginsSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EXCEED_MAX_LOGINS"),
  message: Joi.string().optional()
});

 const loginSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("LOGIN"),
  data: Joi.object({
    accessToken: Joi.string().optional(),
    userId: Joi.string().optional().example("5678zs4rfcty7gyubi34567"),
    email: Joi.string().email().optional().example("user@appinventiv.com"),
    firstName: Joi.string().optional().example("John"),
    lastName: Joi.string().optional().example("Dao"),
    profilePicture:Joi.string().optional().example("https://google.com/profile.jpg"),
    mobileNo: Joi.string().optional().example("9655603897"),
    userType: Joi.string().optional().example("ADMIN"),
  }).optional(),
  message: Joi.string().optional().example("LOGIN")
});

 const resetPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("RESET_PASSWORD"),
  message: Joi.string().optional()
});

 const logoutSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("USER_LOGOUT"),
  message: Joi.string().optional()
});
 const updateStatusSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("UNBLOCK_USER , BLOCK_USER"),
  message: Joi.string().optional()
});

 const emailAlreadyExistSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("EMAIL_ALREADY_EXIST"),
  message: Joi.string().optional()
});

 const matchOldPasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("400"),
  type: Joi.string().optional().example("MATCH_OLD_PASSWORD"),
  message: Joi.string().optional()
});
 const resePasswordSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("RESET_PASSWORD"),
  message: Joi.string().optional()
});
 const eamilRequiredSchema = Joi.object({
  statusCode: Joi.number().integer().optional().example("200"),
  type: Joi.string().optional().example("EMAIL_REQUIRED"),
  message: Joi.string().optional()
});

// Centralized swagger object
export const adminResponse = {
    tokenErrorSchema,
    internalServerSchema,
    profileSchema,
    userNotFoundSchema,
    userAlreadyExistSchema,
    userSignupSchema,
    emailNotRegisteredSchema,
    userBlockedSchema,
    phoneNoAlreadyExistSchema,
    invalidPasswordSchema,
    exceedMaxLoginsSchema,
    loginSchema,
    resetPasswordSchema,
    logoutSchema,
    updateStatusSchema,
    emailAlreadyExistSchema,
    matchOldPasswordSchema,
    resePasswordSchema,
    eamilRequiredSchema,
}

// Individual exports for backward compatibility
export { 
    tokenErrorSchema,
    internalServerSchema,
    profileSchema,
    userNotFoundSchema,
    userAlreadyExistSchema,
    userSignupSchema,
    emailNotRegisteredSchema,
    userBlockedSchema,
    phoneNoAlreadyExistSchema,
    invalidPasswordSchema,
    exceedMaxLoginsSchema,
    loginSchema,
    resetPasswordSchema,
    logoutSchema,
    updateStatusSchema,
    emailAlreadyExistSchema,
    matchOldPasswordSchema,
    resePasswordSchema,
    eamilRequiredSchema,
}