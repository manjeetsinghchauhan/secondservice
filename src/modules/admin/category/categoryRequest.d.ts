/**
 * Filename: categoryRequest.d.ts
 * Purpose:  Define interfaces for category module
 * Owner: Edamama
 * Maintainer: Appinventiv
 */

declare interface AdminCategoriesRequest {
    title: string,
    status: string,
    categoryId: string,
    type: string,
    parent: object,
    totalProducts: number,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortNo: number,
    regStartDate: Date,
    regEndDate: Date,
    lName?: string;
    isParent?: boolean;
    image ?: object;
    icon ?: object;
    hasChild?: boolean;
    rank?: number;
    filters: [],
    level?: number,
    parentId: string,
  }
  
  
  declare interface uploadCategoryRequest {
    categories: string
  }
  