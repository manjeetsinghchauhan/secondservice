import { categoryDaoV1 } from ".";
import { CATEGORY_MESSAGE } from "./categoryConstant";


class CategoryController {
    
    /**
     * @function getAllClubedCategories
     * @description function to fetch all clubbed categories
     * @param params
     * @returns array
     */
    async getAllClubedCategories(params, tokenData) {
    try {
        let categoryData = await categoryDaoV1.getClubbedCategory(params);

        return CATEGORY_MESSAGE.SUCCESS.GET_CATEGORY(categoryData);
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
        const result = await categoryDaoV1.filterAndSearchCategories(params)
        return CATEGORY_MESSAGE.SUCCESS.GET_CATEGORY(result);
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
        const result = await categoryDaoV1.fetchCategory(params);
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
export const categoryController = new CategoryController();