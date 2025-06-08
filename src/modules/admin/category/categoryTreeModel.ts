/**
 * Filename: categoryTreeModel.ts
 * Purpose: Define Schema for categoryTree
 * Owner: dothesmart
 * Maintainer: dothesmart
 */

"use strict";
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { DB_MODEL_REF, STATUS } from "@config/index";
import * as appUtils from "@utils/appUtils";


export interface ICategoryTree extends Document {
  categories:JSON
};


let categoryTreeSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    categories:[]
}, {
    versionKey: false,
    timestamps: true,
  });



  categoryTreeSchema.methods.toJSON = function () {
  let object = appUtils.clean(this.toObject());
  return object;
};

export const category_trees: Model<ICategoryTree> = model<ICategoryTree>(DB_MODEL_REF.CATEGORY_TREE, categoryTreeSchema);