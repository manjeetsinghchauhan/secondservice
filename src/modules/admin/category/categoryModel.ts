import mongoose, { Document, model, Model, Schema } from "mongoose";
import { DB_MODEL_REF, STATUS } from "@config/index";
import * as appUtils from "@utils/appUtils";

export interface ICategory extends Document {
    title: string;
    status: string;
    type: string
}

export let ancestorsCategorySchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, trim: true, default: "" },
    image:{
      url: { type: String, trim: true, required: false  },
      key: { type: String, trim: true, required: false  }
    },
    icon: {
      url: { type: String, trim: true, required: false  },
      key: { type: String, trim: true, required: false }
    },
    lName:{ type: String, trim: true, required: true },
});

let filters = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId , required: true},
    name: { type: String, trim: true, required: true }
})
  
let modifiedBySchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: DB_MODEL_REF.USER,
    },
    //name: { type: String, trim: true, required: false },
    email: { type: String, trim: true, lowercase: true, required: false },
    adminType: { type: String, trim: true, required: false }
}, { _id: false });
  

let categorySchema = new Schema({
    title: { type: String, trim: true, required: true, index: false },
    status: {
      type: String,
      index: true,
      enum: [
        STATUS.BLOCKED,
        STATUS.UN_BLOCKED,
        STATUS.DELETED
      ],
      default: STATUS.UN_BLOCKED
    },
    parentId: { type: String, required:true, index: true, default:'0' },
    lName:{ type: String, trim: true, required: true },
    image:{
      url: { type: String, trim: true, required: false },
      key: { type: String, trim: true, required: false }
    },
    icon: {
      url: { type: String, trim: true, required: false },
      key: { type: String, trim: true, required: false }
    },
    ancestors:[ancestorsCategorySchema],
    totalProducts: { type: Number, default: 0 },
    rank: { type: Number, required: true, index: true},
    filters:[filters],
    level: {type: Number, required: false},
    lastModifiedBy: modifiedBySchema
  }, {
      versionKey: false,
      timestamps: true,
  
    });
  
categorySchema.index({ "createdAt": 1, "title": -1 });

categorySchema.methods.toJSON = function () {
    let object = appUtils.clean(this.toObject());
    return object;
};

export const categories: Model<ICategory> = model<ICategory>(DB_MODEL_REF.CATEGORY, categorySchema);