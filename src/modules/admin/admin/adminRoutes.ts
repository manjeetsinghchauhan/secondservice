import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema,
         adminErrorSchema,
         sucessDataSchema 
        } from "@modules/admin/admin/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminController } from "./adminController";
import { addSchema, listingSchema,validateAdminId, editSchema } from "./routeValidater";


export const adminRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/admins`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminController.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "admin user"],
      description: "Admin uploaded",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: addSchema,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: createDataSchema
            },
            400: {
              description: 'Bad Request',
              schema: adminErrorSchema
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
      method: "GET",
      path: `${SERVER.API_BASE_URL}/admin/admins`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          const query = request.query;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminController.listing(query, tokenData);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "admin user"],
        description: "List All Admin",
        auth: {
          strategies: ["UserAuth"]
        },
        validate: {
          headers: authorizationHeaderObj,
          query: listingSchema,
          failAction: failActionFunction,
        },
        plugins: {
          "hapi-swagger": {
            responses: {
              200: {
                description: 'Success',
                schema: sucessDataSchema
              },
              400: {
                description: 'Bad Request',
                schema: adminErrorSchema
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
    method: "GET",
    path: `${SERVER.API_BASE_URL}/admin/admins/{adminId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminController.searchById(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "admin user"],
      description: "Admin by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateAdminId,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: sucessDataSchema
            },
            400: {
              description: 'Bad Request',
              schema: adminErrorSchema
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
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/admin/admins`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminController.updateById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "admin user"],
      description: "Admin update by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: editSchema,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            200: {
              description: 'Success',
              schema: sucessDataSchema
            },
            400: {
              description: 'Bad Request',
              schema: adminErrorSchema
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
      method: "DELETE",
      path: `${SERVER.API_BASE_URL}/admin/admins/{adminId}`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          let params = request.params;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminController.deleteAdmin(params);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "admin user"],
        description: "Admin Delete Admin",
        auth: {
          strategies: ["UserAuth"]
        },
        validate: {
          headers: authorizationHeaderObj,
          params: validateAdminId,
          failAction: failActionFunction,
          options: {
            abortEarly: false
          }
        },
        plugins: {
          "hapi-swagger": {
            responses: {
              200: {
                description: 'Success',
                schema: sucessDataSchema
              },
              400: {
                description: 'Bad Request',
                schema: adminErrorSchema
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
        }
      }
  }
]