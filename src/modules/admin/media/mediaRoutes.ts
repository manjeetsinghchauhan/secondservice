import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema,
         mediaErrorSchema,
         sucessDataSchema 
        } from "@modules/admin/media/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminMediaController } from ".";
import { addSchema, listingSchema,validateMediaId, editSchema } from "./routeValidater";


export const mediasRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/medias`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminMediaController.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "medias"],
      description: "Media uploaded",
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
      path: `${SERVER.API_BASE_URL}/admin/medias`,
      handler: async (request: any, h: ResponseToolkit) => {
        try {
          const query = request.query;
          const tokenData: TokenData = request.auth?.credentials?.tokenData;
          const result = await adminMediaController.listing(query, tokenData);
          return responseHandler.sendSuccess(request, h, result);
        } catch (error) {
          return responseHandler.sendError(request, error);
        }
      },
      options: {
        tags: ["api", "medias"],
        description: "List All Media",
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
    path: `${SERVER.API_BASE_URL}/admin/medias/{mediaId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminMediaController.searchById(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "medias"],
      description: "Media by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        query: validateMediaId,
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
    path: `${SERVER.API_BASE_URL}/admin/medias`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminMediaController.updateById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "medias"],
      description: "Media update by Id",
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