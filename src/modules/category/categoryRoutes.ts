import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         errorDataSchema,
         sucessDataSchema 
        } from "@modules/category/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { categoryControllerV1 } from ".";
import {  
         listingSchema, 
         validateSearchingFiltering,
         validateCategoryId } from "./routeValidater";

export const appCategoriesRoute = [
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/categories/club`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await categoryControllerV1.getAllClubedCategories(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "app categories"],
      description: "Admin Club Categories",
      auth: {
        strategies: ["BasicAuth"]
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
              schema: errorDataSchema
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
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/categories`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.query;
        const headers = request.headers;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await categoryControllerV1.getAdminCategories({...payload,...headers});
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "app categories"],
      description: "Admin Get Categories",
      auth: {
        strategies: ["BasicAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateSearchingFiltering,
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
              schema: errorDataSchema
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
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/categories/{categoryId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params: AdminCategoriesRequest = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await categoryControllerV1.fetchCategory(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request,error);
      }
    },
    options: {
      tags: ["api", "app categories"],
      description: "Admin Fetch Category",
      auth: {
        strategies: ["BasicAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        params: validateCategoryId,
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
              schema: errorDataSchema
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
