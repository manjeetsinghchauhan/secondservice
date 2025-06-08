"use strict";

import HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";

import { SERVER } from "@config/environment";

// Register Swagger Plugin
export const plugin = {
	name: "swagger-plugin",
	register: async function (server) {
		const swaggerOptions = {
			info: {
				title: "Home Service API Documentation",
				description: "Home Service",
				 contact: {
				 	name: "Manjeet Chauhan",
				 	email: "manjeet.perfect@gmail.com"
				 },
				version: "1.0.0"
			},
			grouping: "tags",
			schemes: [SERVER.PROTOCOL, 'http'],
			basePath: SERVER.API_BASE_URL,
			consumes: [
				"application/json",
				"application/x-www-form-urlencoded",
				"multipart/form-data"
			],
			produces: [
				"application/json"
			],
			securityDefinitions: {
				
				api_key: {
					type: "apiKey",
					name: "api_key",
					in: "header"
				}
			},
			"documentationPath": `/${SERVER.MICROSERVICE_URL}/documentation`,
			"swaggerUIPath": `/${SERVER.MICROSERVICE_URL}/swaggerui`,
			"jsonPath": `/${SERVER.MICROSERVICE_URL}/swagger.json`,
			security: [{
				api_key: []
			}]

		};

		await server.register([
			Inert,
			Vision,
			{
				plugin: HapiSwagger,
				options: swaggerOptions
			}
		]);
	}
};