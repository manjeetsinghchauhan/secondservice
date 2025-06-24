import { ResponseToolkit } from "@hapi/hapi";
import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SERVER } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { userControllerV1 } from "@modules/user/index";
import { changePassword, forgotPassword, login, profile, resetPassword, sendOTP, socialSignup, tempSignUp, updateStatus, verifyOTP, verifySignUp } from "./routeValidation";
import { eamilRequiredSchema, emailAlreadyExistSchema, emailNotRegisteredSchema, exceedMaxLoginsSchema, internalServerSchema, invalidOtpSchema, invalidPasswordSchema, loginSchema, logoutSchema, matchOldPasswordSchema, phoneNoAlreadyExistSchema, profileSchema, resetPasswordSchema, sendOtpSchema, tokenErrorSchema, updateStatusSchema, userAlreadyExistSchema, userBlockedSchema, userNotFoundSchema, userSignupSchema, verifyOtpSchema } from "@modules/user/v1/swaggerResponse";

export const userRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/signup`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload: UserRequest.SignUp = request.payload;
        console.log(payload);
        payload.remoteAddress = request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
        const result = await userControllerV1.tempSignUp(payload);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User SignUp ",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: tempSignUp,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: userSignupSchema
            },
            400: {
              description: 'Bad Request',
              schema: userAlreadyExistSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    }
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/send-otp`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload: UserRequest.SendOtp = request.payload;
        const result = await userControllerV1.sendOTP(payload);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "Send/Resend Otp On Email/mobile no",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: sendOTP,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: sendOtpSchema
            },
            400: {
              description: 'Bad Request',
              schema: phoneNoAlreadyExistSchema || emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            403: {
              description: 'ACCESS FORBIDDEN',
              schema: userBlockedSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/verify-otp`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const headers = request.headers;
        const payload: UserRequest.VerifyOTP = request.payload;
        payload.remoteAddress =
          request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
        const result = await userControllerV1.verifyOTP({
          ...headers,
          ...payload,
        });
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "users"],
      description: "Verify OTP on Forgot Password/Verify Phone Number",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: verifyOTP,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: verifyOtpSchema
            },
            400: {
              description: 'Bad Request',
              schema: invalidOtpSchema || emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            403: {
              description: 'ACCESS FORBIDDEN',
              schema: userBlockedSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/login`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const headers = request.headers;
        const payload: UserRequest.Login = request.payload;
        payload.remoteAddress =
          request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
        const result = await userControllerV1.login({ ...headers, ...payload });
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User Login (Participant/Supporter)",
      notes: "User login via email & password",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: login,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: loginSchema
            },
            400: {
              description: 'Bad Request',
              schema: exceedMaxLoginsSchema || emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema || invalidPasswordSchema
            },
            403: {
              description: 'ACCESS FORBIDDEN',
              schema: userBlockedSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/social-signup`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const headers = request.headers;
        const payload: UserRequest.SignUp = request.payload;
        payload.remoteAddress = request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
        const result = await userControllerV1.socialSignup({ ...headers, ...payload });
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User Social-Signup",
      auth: {
        strategies: ["BasicAuth"]
      },
      validate: {
        headers: headerObject["required"],
        payload: socialSignup,
        failAction: failActionFunction
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: loginSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            400: {
              description: 'Bad Request',
              schema: eamilRequiredSchema || exceedMaxLoginsSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        }
      }
    }
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/forgot-password`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const headers = request.headers;
        const payload: UserRequest.ForgotPassword = request.payload;
        const result = await userControllerV1.forgotPassword({
          ...headers,
          ...payload,
        });
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "users"],
      description: "Forgot Password",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: forgotPassword,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: sendOtpSchema
            },
            400: {
              description: 'Bad Request',
              schema: emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            403: {
              description: 'ACCESS FORBIDDEN',
              schema: userBlockedSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/reset-password`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload: UserRequest.ChangeForgotPassword = request.payload;
        const result = await userControllerV1.resetPassword(payload);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "users"],
      description: "Reset Password After forgot password and verify OTP",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: resetPassword,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: resetPasswordSchema
            },
            400: {
              description: 'Bad Request',
              schema: emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            403: {
              description: 'ACCESS FORBIDDEN',
              schema: userBlockedSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/logout`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await userControllerV1.logout(tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User Logout",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: logoutSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/users/profile`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query: UserId = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await userControllerV1.profile(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User Profile",
      notes: "for Admin/User",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: profile,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: profileSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            400: {
              description: 'Bad Request',
              schema: userNotFoundSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/users/block-unblock`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload: UserRequest.updateStatus = request.payload;
        const result = await userControllerV1.updateStatus(payload);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "users"],
      description: "Update the user status",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: updateStatus,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: updateStatusSchema
            },
            400: {
              description: 'Bad Request',
              schema: emailNotRegisteredSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/users/verify-signup`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const headers = request.headers;
        const payload: UserRequest.VerifyOTP = request.payload;
        payload.remoteAddress =
          request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
        const result = await userControllerV1.verifySignUp({
          ...headers,
          ...payload,
        });
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "users"],
      description: "Verify OTP on for sign-up",
      auth: {
        strategies: ["BasicAuth"],
      },
      validate: {
        headers: headerObject["required"],
        payload: verifySignUp,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: userSignupSchema
            },
            400: {
              description: 'Bad Request',
              schema: emailAlreadyExistSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  },
  {
    method: "PATCH",
    path: `${SERVER.API_BASE_URL}/users/change-password`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await userControllerV1.changePassword(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "users"],
      description: "User change-password",
      notes: "for Admin/User",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload:changePassword,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: resetPasswordSchema
            },
            400: {
              description: 'Bad Request',
              schema: emailAlreadyExistSchema || matchOldPasswordSchema
            },
            401: {
              description: 'Unauthorized',
              schema: tokenErrorSchema
            },
            500: {
              description: 'Internal Server Error',
              schema: internalServerSchema
            }
          }
        },
      },
    },
  }
];
