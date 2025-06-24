"use strict";

import { stringToBoolean } from "@utils/appUtils";
import { HTTP_STATUS_CODE, MESSAGES, SERVER } from "@config/index";

// Register request plugin
export const plugin = {
  name: "request-plugin",
  register: async function (server, options) {
    // Middleware that runs on every request
    server.ext("onRequest", (request, h) => {
      return h.continue;
    });

    // Middleware that runs after authentication
    server.ext("onPostAuth", (request, h) => {
      const path = request.path || "";

      // Skip maintenance logic for safe paths
      if (
        stringToBoolean(SERVER.IS_MAINTENANCE_ENABLE || "false") &&
        !path.includes("/v1/scripts/") &&
        !path.includes("/documentation") &&
        !path.includes("/swagger") &&
        !path.includes("/v1/common/decrypt") &&
        !path.includes("/v1/common/encrypt")
      ) {
        const res = request.raw.res;
        res.writeHead(HTTP_STATUS_CODE.BAD_REQUEST, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify(MESSAGES.ERROR.SERVER_IS_IN_MAINTENANCE()));
        return h.close;
      }

      // Log all incoming request info
      if (request) {
        console.log("--------------------------------REQUEST STARTS----------------------------------------");
        console.log(request.info.remoteAddress + ": " + request.method.toUpperCase() + " " + path);
        console.log("Request Type=======>", request.method.toUpperCase());
        console.log("Request Path=======>", path);
        console.log("Request Body=======>", request.payload || null);
        console.log("Request Params=====>", request.params || {});
        console.log("Request Query======>", request.query || {});
        console.log("Authorization======>", request.headers?.authorization || "undefined");
        console.log("api_key============>", request.headers?.api_key || "undefined");
        console.log("platform===========>", request.headers?.platform || "undefined");
        console.log("timezone===========>", request.headers?.timezone || "undefined");
        console.log("offset=============>", request.headers?.offset || "undefined");
        console.log("language===========>", request.headers?.["accept-language"] || "undefined");
        console.log("--------------------------------REQUEST ENDS------------------------------------------");
      }

      return h.continue;
    });

    // Middleware that runs before response is sent
    server.ext("onPreResponse", (request, h) => {
      if (
        request.response &&
        !request.path.includes("/deeplink")
      ) {
        // Handle error responses
        if (request.response?.output?.payload?.type) {
          request.response.output.message = request.i18n.__(request.response.output.payload.type);
        }

        // Handle successful custom responses
        else if (
          request.response?.source &&
          typeof request.response.source === "object" &&
          request.response.source?.type &&
          request.response.source.type !== "ERROR"
        ) {
          request.response.source.message = request.i18n.__(request.response.source.type);
        }
      }

      return h.continue;
    });
  },
};
