import { SERVER } from "@config/environment";
import { ResponseToolkit } from "@hapi/hapi";
import { internalServerSchema, 
         tokenErrorSchema, 
         createDataSchema, 
         errorDataSchema,
         sucessDataSchema 
        } from "@modules/admin/category/swaggerRespnse";
import { failActionFunction } from "@utils/appUtils";
import { responseHandler } from "@utils/ResponseHandler";
import { authorizationHeaderObj } from "@utils/validator";
import { adminCategoryControllerV1 } from ".";
import { addSchema, 
         listingSchema, 
         validateUpdateRanking, 
         validateSearchingFiltering,
         updateCategory,
         validateCategoryId } from "./routeValidater";

export const categoriesRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/admin/categories`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.adminAddCategory(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Add Category",
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
    path: `${SERVER.API_BASE_URL}/admin/categories/club`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const query = request.query;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.getAllClubedCategories(query, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Club Categories",
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
    path: `${SERVER.API_BASE_URL}/admin/categories/rank`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.updateCategoriesRank(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Update Category Rankings",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: validateUpdateRanking,
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
    },
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/admin/categories`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        const payload = request.query;
        const headers = request.headers;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.getAdminCategories({...payload,...headers});
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Get Categories",
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
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/admin/categories`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let payload = request.payload;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.updateCategoryById(payload, tokenData);
        return responseHandler.sendSuccess(request, h, result );
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Update Category",
      auth: {
        strategies: ["UserAuth"]
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: updateCategory,
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
    path: `${SERVER.API_BASE_URL}/admin/categories/{categoryId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params: AdminCategoriesRequest = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.deleteCategory(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Delete Category",
      auth: {
        strategies: ["UserAuth"]
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
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/admin/categories/{categoryId}`,
    handler: async (request: any, h: ResponseToolkit) => {
      try {
        let params: AdminCategoriesRequest = request.params;
        const tokenData: TokenData = request.auth?.credentials?.tokenData;
        const result = await adminCategoryControllerV1.fetchCategory(params);
        return responseHandler.sendSuccess(request, h, result);
      } catch (error) {
        return responseHandler.sendError(request,error);
      }
    },
    options: {
      tags: ["api", "categories"],
      description: "Admin Fetch Category",
      auth: {
        strategies: ["UserAuth"]
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
