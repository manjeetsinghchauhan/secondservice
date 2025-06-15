import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema,
         errorSchema,
         sucessDataSchema 
        } from "@modules/admin/pincode/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminPincodeController } from "./pincodeController";
import { addSchema, listingSchema,validateByPincode, updateSchema } from "./routeValidater";


export const pincodesRoute = [
{
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/pincodes`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminPincodeController.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "pincodes"],
      description: "Add new Pincode",
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
              schema: errorSchema
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
      path: `${SERVER.API_BASE_URL}/admin/pincodes`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          const query = request.query;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminPincodeController.listing(query, tokenData);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "pincodes"],
        description: "List All pincodes",
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
                schema: errorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/pincodes/{pincode}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminPincodeController.searchByPincode(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "pincodes"],
      description: "Search Pincode details by pincode",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateByPincode,
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
              schema: errorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/pincodes`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminPincodeController.updateByPincode(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "pincodes"],
      description: "Update Pincode details by pincode",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: updateSchema,
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
              schema: errorSchema
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
  }
]