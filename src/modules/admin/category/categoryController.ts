import { adminCategoryDaoV1 } from ".";
import { CATEGORY_MESSAGE } from "./categoryConstant";


class AdminCategoryController {
    
    async adminAddCategory(params,tokenData) {
        try {
            const isExist = await adminCategoryDaoV1.isCategoryExists(params)
            if (isExist) {
              return CATEGORY_MESSAGE.ERROR.CATEGORY_ALREADY_EXIST;
            }
            else {
              params.lName = params.title.replace(CATEGORY_MESSAGE.REGEX.LNAME_REPLACE, '').split(" ").join("-").toLowerCase() + Date.now();
              if (params.parentId === '0' || !params.parentId) {
                params.rank = await adminCategoryDaoV1.getMaxCategoryRank();
              } else {
                params.rank = 0
              }
        
              let step1 = await adminCategoryDaoV1.addCategory(params);
              if (params.parentId && params.parentId != '0') {
                step1 = await adminCategoryDaoV1.buildAncestors(step1);
              }
              // now set the data in redis
        
              // now set the data in category tree json
              adminCategoryDaoV1.setCategoryInRedis(step1);
              // let catObj: any = {};
              // catObj.categoryIds = [step1._id];
              // DiscoverDao.setFilterCategoryDataInRedis(catObj)
            
              return CATEGORY_MESSAGE.SUCCESS.ADD_CATEGORY(step1);
            }
          }
          catch (error) {
            throw error;
          }
    }

    /**
     * @function getAllClubedCategories
     * @description function to fetch all clubbed categories
     * @param params
     * @returns array
     */
    async getAllClubedCategories(params, tokenData) {
    try {
        let categoryData = await adminCategoryDaoV1.getClubbedCategory(params);

        return CATEGORY_MESSAGE.SUCCESS.GET_CATEGORY(categoryData);
    } catch (error) {
        throw error;
        }
    }

    /**
     * @function updateCategoriesRank
     * @description function to all categories rank
     * @param params
     * @returns array
     */
    async updateCategoriesRank (params, tokenData) {
        try {
        let categoryData = await adminCategoryDaoV1.updateCategoryRanks(params);
        adminCategoryDaoV1.setCategoryInRedis(params);
    
        return CATEGORY_MESSAGE.SUCCESS.EDIT_CATEGORY_RANK(categoryData);
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function getAdminCategories
     * @description function to get all category list
     * @param AdminCategoriesRequest
     * @returns array
     */
    async getAdminCategories(params) {
        try {
        const result = await adminCategoryDaoV1.filterAndSearchCategories(params)
        return CATEGORY_MESSAGE.SUCCESS.GET_CATEGORY(result);
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function updateCategoryById
     * @description function to update category by  category id
     * @param AdminCategoriesRequest
     * @returns array
     */
    async updateCategoryById (params, tokenData) {
        try {
        const result = await adminCategoryDaoV1.updateCategory(params, tokenData);
        if (!result) {
            return Promise.reject(CATEGORY_MESSAGE.ERROR.CATEGORY_NOT_FOUND);
        } else {
            if (result.parentId != '0') {
            result.categoryId = result._id;
            await adminCategoryDaoV1.buildAncestors(result);
            await adminCategoryDaoV1.buildAncestorsFull(result);
    
            }
            if (params.title) {
            await adminCategoryDaoV1.updateAllRespectiveCategories(result);
            }
    
            if (params.status) {
            await adminCategoryDaoV1.updateAllCategoryRespectiveStatus(result);
            //adminCategoryDaoV1.updateCategoryStatusInProducts(result);
            }
    
            if (params.image || params.icon) {  
            await adminCategoryDaoV1.updateAllCategoryRespectiveImages(params)
            }
    
            // now set the data in redis
    
            // now update category in category tree collection
    
            adminCategoryDaoV1.setCategoryInRedis(result);
    
            // let catObj: any = {};
            // catObj.categoryIds = [result._id];
    
            // DiscoverDao.setFilterCategoryDataInRedis(catObj)
    
            return CATEGORY_MESSAGE.SUCCESS.CATEGORY_UPDATED_SUCCESSFULLY(result);
        }
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function deleteCategory
     * @description function to delete category by id
     * @param params
     * @returns object
     */
    async deleteCategory(params) {
        try {
        const result = await adminCategoryDaoV1.deleteCategory(params);
        if (!result) {
            return Promise.reject(CATEGORY_MESSAGE.ERROR.CATEGORY_NOT_FOUND);
        }
        else {
            await adminCategoryDaoV1.updateAllCategoryRespectiveStatus(result);
            // now set the data in redis
    
            // now set the data in category tree collection
    
            adminCategoryDaoV1.setCategoryInRedis(result);
            //adminCategoryDaoV1.updateCategoryInProducts(result)
    
            return CATEGORY_MESSAGE.SUCCESS.DELETE_CATEGORY;
        }
        } catch (error) {
        throw error;
        }
    }

    /**
     * @function fetchCategory
     * @description function to fetch category by id
     * @param params
     * @returns object
     */
    async fetchCategory(params) {
        try {
        const result = await adminCategoryDaoV1.fetchCategory(params);
        if (!result) {
            return Promise.reject(CATEGORY_MESSAGE.ERROR.CATEGORY_NOT_FOUND);
        }
        else {
            return CATEGORY_MESSAGE.SUCCESS.GET_CATEGORY(result);
        }
        } catch (error) {
        throw error;
        }
    }
}
export const adminCategoryController = new AdminCategoryController();