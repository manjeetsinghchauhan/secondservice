import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema, 
         errorDataSchema,
         sucessDataSchema 
        } from "@modules/admin/service/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminServiceController } from ".";
import { addSchema, 
         listingSchema, 
         validateSearchingFiltering,
         updateService,
         validateServiceId } from "./routeValidater";

export const servicesRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/services`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminServiceController.adminAddService(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "services"],
      description: "Admin Add Service",
      auth: {
        strategies: ["UserAuth"]
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
    path: `${SERVER.API_BASE_URL}/admin/services`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.query;
        const headers = request.headers;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminServiceController.getAdminServices({...payload,...headers});
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "services"],
      description: "Admin get all services",
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
    path: `${SERVER.API_BASE_URL}/admin/service/{serviceId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminServiceController.fetchService(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request,error);
      }
    },
    options: {
      tags: ["api", "services"],
      description: "Admin Fetch Service",
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
  },
  {
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/admin/services`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminServiceController.updateServiceById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result );
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "services"],
      description: "Admin Update Service",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: updateService,
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
    method: "DELETE",
    path: `${SERVER.API_BASE_URL}/admin/services/{serviceId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminServiceController.deleteService(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "services"],
      description: "Admin Delete Service",
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
