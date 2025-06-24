import "module-alias/register";
import fs from "fs";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import { SERVER } from "@config/index";

// create folder for upload if not exist
if (!fs.existsSync(SERVER.UPLOAD_DIR)) fs.mkdirSync(SERVER.UPLOAD_DIR);
// create folder for logs if not exist
if (!fs.existsSync(SERVER.LOG_DIR)) fs.mkdirSync(SERVER.LOG_DIR);

import { logger } from "@lib/logger";
import { plugins } from "@plugins/index";
import { routes } from "@routes/index";
import { bootstrap } from "@utils/BootStrap";

  class App {
    private server!: any;
    private Port!: string | number | undefined;
  
    constructor() {
      this.startapp();
    }
    private async startapp() {
      this.template();
      this.Port = (process.env.PORT || process.env.INSTANT_PORT);
      await this.startserver();
      await bootstrap.bootStrap(this.server);
    }
    public template () {
      console.log("");
      console.log(`****************************** ${SERVER.APP_NAME} Starting ********************************`);
      console.log("");
      console.log("env : ", process.env.NODE_ENV.trim());
    }
    private async startserver() {
      this.server = Hapi.server({
        port: SERVER.PORT,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'], // or your exact domain
              headers: [
                'Accept',
                'Content-Type',
                'Authorization',
                'api_key',
                'accept-language',
                'platform',
                'timezone',
                'offset',
              ],
              additionalHeaders: [
                'Accept',
                'Content-Type',
                'Authorization',
                'api_key',
                'accept-language',
                'platform',
                'timezone',
                'offset',
              ],
              credentials: true, // if sending cookies or auth headers
            },
          },
      });

      //swagger plugin
      await this.server.register(plugins);
      await this.server.start();
      this.callback();
      //start package call
      await this.start();
      //routes call
      this.localRoutes();
      
    }
    private start = async () => {
    
      await this.server.register(Vision);
      // To use a cookie
      this.server.state("data", {
        ttl: null,
        isSecure: true,
        isHttpOnly: true,
        encoding: "base64json",
        clearInvalid: true,
        strictHeader: true,
      });
    
      this.server.views({
        engines: {
          html: require("handlebars"),
        },
        path: "src/views",
      });
    
      routes.push({
        method: "GET",
        path: "/src/uploads/".toString() + `{path*}`, // ' /views/uploads/image/{path*}',
        options: {
          handler: {
            directory: {
              path: process.cwd() + "/src/uploads/".toString(),
              listing: false,
            },
          },
        },
      });
      
      // register i18n plugin
      await this.server.register({
        plugin: require("hapi-i18n"),
        options: {
          locales: ["en", "ar"],
          directory: process.cwd() + "/locales",
          languageHeaderField: "accept-language",
          defaultLocale: "en",
        },
      });
    };
    private async localRoutes() {
      await this.server.route({
        method: 'OPTIONS',
        path: '/{any*}',
        options: {
          auth: false,
        },
        handler: (request, h) => {
          return h
            .response()
            .code(204)
            .header('Access-Control-Allow-Origin', request.headers.origin || '*')
            .header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            .header(
              'Access-Control-Allow-Headers',
              'Accept, Content-Type, Authorization, api_key, accept-language, platform, timezone, offset'
            )
            .header('Access-Control-Allow-Credentials', 'true');
        },
      });

      await this.server.route(routes);
    }
    private callback = () => {
      logger.info(` Hapi server swagger is running this URL :- ${SERVER.APP_URL}/${SERVER.MICROSERVICE_URL}/documentation`);
      console.log(`server is started on this port ${this.Port}`);
    };
  }
  
  new App();