import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, tokenErrorSchema, userAlreadyExistSchema } from "@modules/user/v1/swaggerResponse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { appSyncControllerV1 } from "..";
import { addSchema, deleteSchema, editSchema, listingSchema } from "./routeValidater";
import { sucessDataSchema } from "./swaggerRespnse";


export const appSyncRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/aapSync`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await appSyncControllerV1.add(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "appSync"],
      description: "add appSync ",
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
              schema: sucessDataSchema
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
    method: "GET",
    path: `${SERVER.API_BASE_URL}/aapSync`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        console.log("token data ::::",tokenData)
        const result = await appSyncControllerV1.listing(query,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "appSync"],
      description: "listing appSync ",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: listingSchema,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: sucessDataSchema
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
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/aapSync`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await appSyncControllerV1.edit(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "appSync"],
      description: "add appSync ",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: editSchema,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: sucessDataSchema
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
    method: "DELETE",
    path: `${SERVER.API_BASE_URL}/aapSync`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await appSyncControllerV1.delete(payload,tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "appSync"],
      description: "add appSync ",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: deleteSchema,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            201: {
              description: 'Success',
              schema: sucessDataSchema
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
  }
]