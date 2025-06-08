import * as _ from "lodash";
import { DB_MODEL_REF, STATUS, DEFAULT } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { title } from "process";
import { SERVICE_MESSAGE } from "./serviceConstant";

export class AdminServiceDao extends BaseDao {
    public serviceDB: any = DB_MODEL_REF.SERVICE;

     /**
     * @function isServiceExists
     * @description function to check if service exist
     * @param params
     * @returns object
     */
    async isServiceExists(params) {

        let query: any = {};

        if (params.serviceId) {
            query._id = { $ne: params.serviceId };
        }

        query.categoryId = params.categoryId
        query.status = { "$ne": STATUS.DELETED };
        query.name = { '$regex': `^${params.name.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")}$`, $options: 'i' }
        return await this.findOne(this.serviceDB, query, {}, {})
    }

     /**
    * @function addService
    * @description function to add service data
    * @param params
    * @returns object
    */
    async addService(params) {
        return await this.save(this.serviceDB, params);
    }

    /**
     * @function setServiceInRedis
     * @description function to set all categories data in redis
     * @param params
     * @returns 
     */

    async setServiceInRedis(params) {

        //let serviceData = await this.getServiceDataFromDb(params);
        return;
    }




    /**
     * @function deleteService
     * @description function to delete service
     * @param params
     * @returns object
     */
    async deleteService(params) {
        let query: any = {};
        query._id = params.serviceId;
        query.status = { '$ne': STATUS.DELETED };
        let update = {};
        update["$set"] = {
        status: STATUS.DELETED
        };
        let options = { new: true };
        return await this.findOneAndUpdate(this.serviceDB, query, update, options);
    }

      /**
     * @function fetchService
     * @description function to fetch category
     * @param params
     * @returns object
     */
      async fetchService(params) {
        let serviceId = params.serviceId;
        let matchQuery = {
          _id: new mongoose.Types.ObjectId(serviceId),
          status: { '$ne': STATUS.DELETED }
        };
      
        const pipeline = [
          { $match: matchQuery },
          {
            $lookup: {
              from: "brands",
              let: { brandIds: "$brand" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$brandIds"] },
                        { $ne: ["$status", "BLOCKED"] }
                      ]
                    }
                  }
                }
              ],
              as: "brandData"
            }
          },
          {
            $lookup: {
              from: "attributes",
              let: { attributeIds: "$attribute" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$attributeIds"] },
                        { $ne: ["$status", "BLOCKED"] }
                      ]
                    }
                  }
                }
              ],
              as: "attributeData"
            }
          },
          {
            $lookup: {
              from: "categories",
              let: { categoryIds: "$category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$categoryIds"] },
                        { $ne: ["$status", "BLOCKED"] }
                      ]
                    }
                  }
                }
              ],
              as: "categoryData"
            }
          },
          { "$project": { _id: 1, name: 1, type:1, averageRatings:1, reviewerCount:1, 
            bundleBuying:1, bundleDiscount:1, isSubscribable:1, subscriptionDiscount:1, 
            dealOfTheDay:1, dealOfTheDayDiscount:1, isRefundable:1, refundPeriod:1, 
            isPublished:1, isFeatured:1, bookedCount:1, status: 1, salePrice: 1, 
            defaultPrice: 1, lName: 1, createdAt: 1, updatedAt: 1, categoryData:1, attributeData: 1, brandData:1 } },
        ];
      
        const result = await this.aggregate(this.serviceDB, pipeline, {})
        return result[0] || null;
      }
      

/**
 * @function filterAndSearchServices
 * @description function to filter/search category listing
 * @param params
 * @returns array
 */

  async filterAndSearchServices(params) {
    let { serviceId, categoryId, brandId, page, limit, search, sortBy, sortNo, status } = params;
    let query: any = {};
    let sort: any = {};
    let sorted;
    let pagination: any = {};
    
    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit && limit > 0 ? parseInt(limit) : 10;

    if (sortNo) {
      if (sortNo == 1) {
        sorted = 1
      } else {
        sorted = -1
      }
    } else {
      sorted = -1
    }

    if (sortBy) {
      if (sortBy === 'title')
        sort = { 'title': sorted }
      else if (sortBy === 'createdAt') {
        sort = { 'createdAt': sorted }
      }
    }   

    if (serviceId) {
      query._id = new mongoose.Types.ObjectId(serviceId);
    }

    if (categoryId) {
      const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
      query.category = {
        $in: categoryIds.map(id => new mongoose.Types.ObjectId(id))
      };
    }  

    if (brandId) {
      const brandIds = Array.isArray(brandId) ? brandId : [brandId];
      query.brand = {
        $in: brandIds.map(id => new mongoose.Types.ObjectId(id))
      };
    }    

    if (search) {
      query = {
        searchKeywords: { "$regex": params.search, "$options": "i" },
        status: { "$ne": STATUS.DELETED }
      }
      if (sortBy && sortNo)
        sort
      else
        sort = { 'createdAt': -1 }
    };

    if (status) {
      query.status = status
    } else {
      query.status = { "$ne": STATUS.DELETED };
    }

    pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    }

    let pipeline = [
      { $match: query },
      {
        $lookup:
        {
          from: "attributes",
          localField: "attribute",
          foreignField: "_id",
          as: "attributeData"
        }
      },
      {
        $lookup:
        {
          from: "brands",
          let: { brandIds: "$brand" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$brandIds"] },
                    { $ne: ["$status", "BLOCKED"] }
                  ]
                }
              }
            }
          ],
          as: "brandData"
        }
      },
      { "$project": { _id: 1, name: 1, type:1, averageRatings:1, reviewerCount:1, 
        bundleBuying:1, bundleDiscount:1, isSubscribable:1, subscriptionDiscount:1, 
        dealOfTheDay:1, dealOfTheDayDiscount:1, isRefundable:1, refundPeriod:1, 
        isPublished:1, isFeatured:1, bookedCount:1, status: 1, salePrice: 1, 
        defaultPrice: 1, lName: 1, createdAt: 1, updatedAt: 1, attributeData: 1, brandData:1 } },
      { "$sort": { createdAt: -1 } },
      {
        '$facet': {
          edges: [
            { '$skip': DEFAULT.PAGING_LIMIT_IN_APP * (page - 1) },
            { '$limit': limit }
          ],
          pageInfo: [
            { '$group': { _id: null, count: { '$sum': 1 } } }
          ]
        }
      }

    ]

    let services = await this.aggregate(this.serviceDB, pipeline, {})


    let result: any = {}
    let totalCount = 0;

    if (services[0].pageInfo[0]) {
      totalCount = services[0].pageInfo[0].count;
      services = services[0].edges;
    } else {
      totalCount = 0;
      services = [];
    }

    result.totalCount = totalCount;
    result.page = page;
    result.limit = limit;
    result.services = services;
    return result;
  }

  /**
     * @function updateService
     * @description function to update service
     * @param params
     * @returns object
     */
    async updateService(params) {
      try {
        let query: any = {}
        let update: any = {};
        query._id = params.serviceId;
        delete params.serviceId;
        update["$set"] = params;
        await this.updateOne(this.serviceDB, query, update, {});
      } catch (error) {
        console.error("ServiceDao :: edit", error);
        throw error;

      }
    }    

}
export const adminServiceDao = new AdminServiceDao();