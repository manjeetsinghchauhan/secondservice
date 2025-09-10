import { ResponseToolkit } from "@hapi/hapi";
import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SERVER } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { adminController } from "@modules/admin/admin/index";
import { adminValidation } from "./routeValidation";
import { adminResponse } from "@modules/admin/admin/swaggerResponse";

export const adminRoute = [
    {
        method: "POST",
        path: `${SERVER.API_BASE_URL}/admins/signup`,
        handler: async (request: any, h: ResponseToolkit) => {
          try {
            const payload: UserRequest.SignUp = request.payload;
            console.log(payload);
            payload.remoteAddress = request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
            const result = await adminController.signUp(payload);
            return responseHandler.sendSuccess(request, h, result);
          } catch (error) {
            return responseHandler.sendError(request, error);
          }
        },
        options: {
          tags: ["api", "Admin"],
          description: "Admin SignUp ",
          auth: {
            strategies: ["BasicAuth"],
          },
          validate: {
            headers: headerObject["required"],
            payload: adminValidation.adminSignup,
            failAction: failActionFunction,
          },
          plugins: {
            "hapi-swagger": {
              responses: {
                201: {
                  description: 'Success',
                  schema: adminResponse.userSignupSchema
                },
                400: {
                  description: 'Bad Request',
                  schema: adminResponse.userAlreadyExistSchema
                },
                401: {
                  description: 'Unauthorized',
                  schema: adminResponse.tokenErrorSchema
                },
                500: {
                  description: 'Internal Server Error',
                  schema: adminResponse.internalServerSchema
                }
              }
            },
          },
        }
    },
    {
        method: "POST",
        path: `${SERVER.API_BASE_URL}/admins/login`,
        handler: async (request: any, h: ResponseToolkit) => {
          try {
            const headers = request.headers;
            const payload: UserRequest.Login = request.payload;
            payload.remoteAddress = request["headers"]["x-forwarded-for"] || request.info.remoteAddress;
            const result = await adminController.login({ ...headers, ...payload });
            return responseHandler.sendSuccess(request, h, result);
          } catch (error) {
            return responseHandler.sendError(request, error);
          }
        },
        options: {
          tags: ["api", "Admin"],
          description: "Admin Login",
          notes: "Admin login via email & password",
          auth: {
            strategies: ["BasicAuth"],
          },
          validate: {
            headers: headerObject["required"],
            payload: adminValidation.login,
            failAction: failActionFunction,
          },
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: 'Success',
                  schema: adminResponse.loginSchema
                },
                400: {
                  description: 'Bad Request',
                  schema: adminResponse.exceedMaxLoginsSchema || adminResponse.emailNotRegisteredSchema
                },
                401: {
                  description: 'Unauthorized',
                  schema: adminResponse.tokenErrorSchema || adminResponse.invalidPasswordSchema
                },
                403: {
                  description: 'ACCESS FORBIDDEN',
                  schema: adminResponse.userBlockedSchema
                },
                500: {
                  description: 'Internal Server Error',
                  schema: adminResponse.internalServerSchema
                }
              }
            },
          },
        },
    }
]