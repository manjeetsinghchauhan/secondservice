import * as _ from "lodash";
import { DB_MODEL_REF, STATUS, DEFAULT } from "@config/main.constant";
import { BaseDao } from "@modules/baseDao";
import { toObjectId } from "@utils/appUtils";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { title } from "process";
import { CATEGORY_MESSAGE } from "./categoryConstant";

export class CategoryDao extends BaseDao {
    public categoryDB: any = DB_MODEL_REF.CATEGORY;
    public categoryTreeDB: any = DB_MODEL_REF.CATEGORY_TREE;

    /**
     * @function buildAncestors
     * @description function to build accestors for added category
     * @param params
     * @returns array
     */
    async buildAncestors(params) {

        let query: any = {};

        query._id = params.parentId;
        query.status = { "$ne": STATUS.DELETED }

        let projection: any = {
            title: 1,
            lName: 1,
            ancestors: 1,
            image: 1,
            icon: 1
        };

        let options: any = {
            lean: true
        }

        let categoryParent = await this.findOne(this.categoryDB, query, projection, options);


        let parentAncestors = [];
        if (categoryParent.ancestors) {
            parentAncestors = categoryParent.ancestors;
        }

        let adjacentParentObj: any = {
            _id: categoryParent._id,
            title: categoryParent.title,
            lName: categoryParent.lName
        }

        if (categoryParent.image && categoryParent.image.url) {
            adjacentParentObj.image = categoryParent.image
        }

        if (categoryParent.icon && categoryParent.icon.url) {
            adjacentParentObj.icon = categoryParent.icon
        }

        parentAncestors.unshift(adjacentParentObj)

        parentAncestors = _.uniqBy(parentAncestors, 'lName')

        console.log("parent ancestors");
        console.log(parentAncestors)


        // now update ancestors for added category
        if (params.categoryId) {
        return await this.findByIdAndUpdate(this.categoryDB, { '_id': params._id }, { "$set": { "ancestors": parentAncestors } }, {})
        } else {
        return await this.findByIdAndUpdate(this.categoryDB, { '_id': params._id }, { "$addToSet": { "ancestors": parentAncestors } }, {})
        }
    }

     /**
     * @function getCategoryDataFromDb- function to get all category data from database
     * @param params - category params
     * @return {array} category list
     */
    async getCategoryDataFromDb(params) {
        let query: any = {};

        query.parentId = '0';
        query.status = STATUS.UN_BLOCKED;

        if (params.search) {
            query.title = { '$regex': `^${params.search}$`, $options: '-i' }
        }

        let projection: any = {
            status: 0,
            createdAt: 0,
            updatedAt: 0,
            parentId: 0,
            ancestors: 0,
            type: 0,
            parent: 0,
            lastModifiedBy: 0
        }

        let option: any = {
        lean: true
        }

        let parentData = await this.find(this.categoryDB, query, projection, option, { 'rank': 1 })

        let finalData = [];
        for (let cat of parentData) {

        let parentCatObj: any = {}
        parentCatObj = cat;
        parentCatObj.subCategories = await this.getSubCategories(cat);
        let isLeafNode = true;
        if (parentCatObj.subCategories.length > 0) {
            // isLeafNode = await parentCatObj.subCategories.some((value)=> { return (value.subCategories && value.subCategories.length > 0 ? false: true ); })
            isLeafNode = false
        }

        parentCatObj.isLeafNode = isLeafNode

        finalData.push(parentCatObj)
        }
        //client.set(`category_${process.env.NODE_ENV}`,JSON.stringify(finalData));
        return finalData;
    }

    /**
     * @function getSubCategories- function to get all subcategories
     * @param params - category params
     * @return {array} category list
     */
    async getSubCategories(category) {
        let query: any = {};

        query.parentId = category._id;
        query.status = STATUS.UN_BLOCKED


        let projection: any = {
            status: 0,
            createdAt: 0,
            updatedAt: 0,
            ancestors: 0,
            type: 0,
            lastModifiedBy: 0
        }

        let option: any = {
        lean: true
        }

        let subCategory = await this.find(this.categoryDB, query, projection, option);

        let finalData = []
        for (let subcat of subCategory) {

        let subCatObj: any = {}
        subCatObj = subcat;
        subCatObj.subCategories = await this.getSubCategories(subcat);
        let isLeafNode = true;
        if (subCatObj.subCategories.length > 0) {
            //isLeafNode = await subCatObj.subCategories.some((value)=> { return (value.subCategories && value.subCategories.length > 0 ? false: true ); })
            isLeafNode = false
        }
        subCatObj.isLeafNode = isLeafNode
        finalData.push(subCatObj)
        }

        return finalData;
    }

   /**
   * @function getClubbedCategory
   * @description function to get all clubbed categories
   * @returns array
   */

  async getClubbedCategory(params) {

    let { page, limit, search } = params;

    let parentIdsArray = await this.getParentIds(params)

    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit && limit > 0 ? parseInt(limit) :  DEFAULT.PAGING_LIMIT_IN_APP;
    const skip = limit * (page - 1);

    let query: any = {};

    query._id = { "$nin": parentIdsArray };

    query.status = STATUS.UN_BLOCKED;

    if (params.search) {
      query.name = { "$regex": params.search, "$options": "i" }
    }

    let pipeline = [
      { "$match": query },
      {
        $addFields: {
          parentId: {
            $cond: { if: { $ne: ["$parentId", '0'] }, then: { $toObjectId: "$parentId" }, else: "$parentId" }
          }
        }
      },
      {
        $lookup:
        {
          from: this.categoryDB,
          let: { parentId: "$parentId" },
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$parentId"] },
                  { $eq: ["$status", STATUS.UN_BLOCKED] }
                ]
              }
            }
          }],
          as: "parentData"
        }
      },
      { "$unwind": { path: '$parentData', preserveNullAndEmptyArrays: true } },
      { $project: { status: 0, totalProducts: 0, lastModifiedBy: 0, createdAt: 0, updatedAt: 0 } },
      {
        $group: {
          //_id: {$cond:{if: { $ne: ["$parentId", '0'] }, then: '$parentId', else: '$_id' }},
          _id: "$parentId",
          title: { "$first": { $cond: { if: { $ne: ["$parentId", '0'] }, then: '$parentData.title', else: '$title' } } },
          //name: {"$first":"$parentData.title"},
          subCategories: { "$push": "$$ROOT" }
        }
      },
      //   {$project: {
      //     subCategories: {
      //        $filter: {
      //           input: "$subCategories",
      //           as: "subcat",
      //           cond: { $ne: [ "$$subcat.parentId", '0' ] }
      //        }
      //     },
      //     _id:1,
      //     name:1
      //  }},
      {
        '$facet': {
          edges: [
            { '$skip': skip },
            { '$limit': limit }
          ],
          pageInfo: [
            { '$group': { _id: null, count: { '$sum': 1 } } }
          ]
        }
      }
    ]

    let values = await this.aggregate(this.categoryDB, pipeline, {});

    console.log("values");
    console.log(values)

    let result: any = {}
    let totalCount = 0;
    let categories: any = [];
    if (values[0].pageInfo[0]) {
      totalCount = values[0].pageInfo[0].count;
      categories = values[0].edges;
    }

    result.totalCount = totalCount;
    result.page = page;
    result.limit = limit;
    result.categories = categories;
    return result;
  } 

  /**
   * @function getParentIds
   * @description function to get all parent category array
   * @returns array
   */
  async getParentIds(params) {
    let query: any = {};

    query.status = STATUS.UN_BLOCKED;
    query.parentId = { "$ne": '0' };

    let projection: any = {
      parentId: 1
    }

    let parentIdData = await this.find(this.categoryDB, query, projection, {});

    let parentIds = await _.map(parentIdData, 'parentId');

    parentIds = _.union(parentIds)

    parentIds = parentIds.map(element => toObjectId(element))

    return parentIds;
  }

/**
 * @function filterAndSearchCategories
 * @description function to filter/search category listing
 * @param params
 * @returns array
 */
  async filterAndSearchCategories(params) {
      let { page, limit, search, sortBy, sortNo, regStartDate, regEndDate, status, isParent, parentId, level } = params;
      let query: any = {};
      let sort: any = {};
      let sorted = -1;
      let pagination: any = {};
      let step: any = {};
  
      
      page = page && page > 0 ? parseInt(page) : 1;
      limit = limit && limit > 0 ? parseInt(limit) : 10;
  
      if (sortNo && sortNo == 1) {
          sorted = 1
        } 
  
      if (sortBy) {
      switch (sortBy) {
          case 'title':
          sort = { title: sorted };
          break;
          case 'totalProducts':
          sort = { totalProducts: sorted };
          break;
          case 'type':
          sort = { type: sorted };
          break;
          case 'createdAt':
          sort = { createdAt: sorted };
          break;
          case 'rank':
          sort = { rank: sorted };
          break;
          default:
          sort = { createdAt: sorted };
          break;
      }
      } else {
      if (isParent === true) {
          sort = { rank: sorted };
      } else {
          sort = { createdAt: -1 };
      }
      }
  
      if (search) {
        query = {
          title: { "$regex": params.search, "$options": "i" },
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
  
      if (isParent === true) {
        query['parentId'] = '0'
      } else if (isParent === false) {
        query['parentId'] = { '$ne': '0' }
      }
  
      if (parentId) {
        query['parentId'] = parentId
      }
  
      pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort
      }
  
      if (regStartDate && regEndDate) {
        query.createdAt = { "$gte": regStartDate, "$lte": regEndDate }
      }
      else if (regStartDate != undefined) {
        query.createdAt = { "$gte": regStartDate }
      }
      else if (regEndDate != undefined) {
        query.createdAt = { "$lte": regEndDate }
      }
  
      if(level!=undefined) {
        query.level = level
      }
  
      let pipeline = [
        { $match: query },
        { "$unwind": { path: "$filters", preserveNullAndEmptyArrays: true } },
        { "$unwind": { path: "$filters_data", preserveNullAndEmptyArrays: true } },
        { "$project": { _id: 1, 'filters_data._id': 1, 'filters_data.name': 1, status: 1, title: 1, icon: 1, level: 1, lName: 1, rank: 1, ancestors: 1, createdAt: 1, totalProducts: 1, updatedAt: 1, parentId: 1 } },
        { "$group": { "_id": "$_id", filters: { "$push": "$filters_data" }, status: { "$first": "$status" }, title: { "$first": "$title" }, icon: { "$first": "$icon" }, level: { "$first": "$level" }, lName: { "$first": "$lName" }, rank: { "$first": "$rank" }, ancestors: { "$first": "$ancestors" }, createdAt: { "$first": "$createdAt" }, totalProducts: { "$first": "$totalProducts" }, updatedAt: { "$first": "$updatedAt" }, parentId: { "$first": "$parentId" } } },
        { "$sort":  sort },
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
      console.log("Pipeline", pipeline);
      let categories = await this.aggregate(this.categoryDB, pipeline, {})
  
  
      let result: any = {}
      let totalCount = 0;
  
      if (categories[0].pageInfo[0]) {
        totalCount = categories[0].pageInfo[0].count;
        categories = categories[0].edges;
      } else {
        totalCount = 0;
        categories = [];
      }
  
      result.totalCount = totalCount;
      result.page = page;
      result.limit = limit;
      result.categories = categories;
      return result;
  } 

  /**
   * @function fetchCategory
   * @description function to fetch category
   * @param params
   * @returns object
   */
  async fetchCategory(params) {
      let query: any = {};
      query._id = params.categoryId;
      query.status = { '$ne': STATUS.DELETED };
      return await this.findOne(this.categoryDB, query, {}, {});
  }

}

export const categoryDao = new CategoryDao();