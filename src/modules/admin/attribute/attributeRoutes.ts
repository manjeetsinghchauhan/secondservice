import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema,
         mediaErrorSchema,
         sucessDataSchema 
        } from "@modules/admin/attribute/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminAttributeController } from "./attributeController";
import { addSchema, listingSchema,validateAttributeId, editSchema } from "./routeValidater";


export const attributesRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/attributes`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminAttributeController.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "attributes"],
      description: "Add new Attribute",
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
              schema: mediaErrorSchema
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
      path: `${SERVER.API_BASE_URL}/admin/attributes`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          const query = request.query;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminAttributeController.listing(query, tokenData);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "attributes"],
        description: "List All Attributes",
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
                schema: mediaErrorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/attributes/{attributeId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminAttributeController.searchById(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "attributes"],
      description: "Search Attributes by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateAttributeId,
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
              schema: mediaErrorSchema
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
    path: `${SERVER.API_BASE_URL}/admin/attributes`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminAttributeController.updateById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "attributes"],
      description: "Update Attribute by Id",
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
              schema: mediaErrorSchema
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