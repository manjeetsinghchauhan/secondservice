import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         errorDataSchema,
         sucessDataSchema 
        } from "@modules/service/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { serviceController } from ".";
import { validateSearchingFiltering, validateServiceId } from "./routeValidater";

export const appServicesRoute = [
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/services`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.query;
        const headers = request.headers;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await serviceController.getServices({...payload,...headers});
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "app services"],
      description: "Get all services",
      auth: {
        strategies: ["UserAuth"]
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
    path: `${SERVER.API_BASE_URL}/service/{serviceId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await serviceController.fetchService(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request,error);
      }
    },
    options: {
      tags: ["api", "app services"],
      description: "Fetch Service by Id",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        params: validateServiceId,
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
