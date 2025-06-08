import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema,
         brandErrorSchema,
         sucessDataSchema 
        } from "@modules/admin/brand/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminBrandController } from "./brandController";
import { addSchema, listingSchema,validateBrandId, editSchema } from "./routeValidater";


export const brandsRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/brands`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminBrandController.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "brands"],
      description: "Brand uploaded",
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
              schema: brandErrorSchema
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
      path: `${SERVER.API_BASE_URL}/admin/brands`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          const query = request.query;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminBrandController.listing(query, tokenData);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "brands"],
        description: "List All Brands",
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
                schema: brandErrorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/brands/{brandId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminBrandController.searchById(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "brands"],
      description: "Brand by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateBrandId,
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
              schema: brandErrorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/brands`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminBrandController.updateById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "brands"],
      description: "Brand update by Id",
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
              schema: brandErrorSchema
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
      path: `${SERVER.API_BASE_URL}/admin/brands/{brandId}`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          let params = request.params;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminBrandController.deleteBrand(params);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "brands"],
        description: "Admin Delete Brand",
        auth: {
          strategies: ["UserAuth"]
        },
        validate: {
          headers: authorizationHeaderObj,
          params: validateBrandId,
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
                schema: brandErrorSchema
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