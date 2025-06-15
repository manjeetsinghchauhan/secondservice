import {  SERVER } from "@config/index";
import { Database } from "@utils/Database";
import { redisClient } from "@lib/redis/RedisClient";

export class BootStrap {
  private dataBaseService = new Database();
  // static readonly BootStrap: any;

  async bootStrap(server) {
    try{
      await this.dataBaseService.connectToDb();
      console.log("Database connection established successfully.");

      // insert default data
      await this.dataBaseService.insertDefaultData();
      console.log("Default data inserted successfully.");
    
    }
    catch (error) {
      console.error("Error in database connection:", error);
      throw error;
    }
    
    // If redis is enabled
    if (SERVER.IS_REDIS_ENABLE) redisClient.init();

    if (SERVER.ENVIRONMENT === "production") {
      console.log = function () {};
    }
  }
}
export const  bootstrap = new BootStrap();