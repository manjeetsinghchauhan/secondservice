/**
 * Filename: serviceModel.ts
 * Purpose: Define Schema for services
 * Owner: Homeservice
 * Maintainer: dothesmart
 */

"use strict";

import * as mongoose from "mongoose";
import { Model } from "mongoose";
import * as config from "@config/index";
import { describe } from "node:test";

let Schema = mongoose.Schema;
export interface IService extends mongoose.Document {
  name: string;
  status: string;
}

let pageInfo = new Schema({
  page: { type: Number, default: 0, required: false },
  limit: { type: Number, default: 0, required: false },
})

let typeSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
})

let modifiedBySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: config.DB_MODEL_REF.USER,
  },
  email: { type: String, trim: true, lowercase: true, required: false },
  adminType: { type: String, trim: true, required: false }
}, { _id: false });


let ServiceSchema = new Schema({
  name: { type: String, trim: true, required: true, index: false },
  lName: { type: String, trim: true, required: true, unique: true },
  description: { type: String, trim: true, required: false },
  type: typeSchema,
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: config.DB_MODEL_REF.CATEGORY,
    required: false
  }],
  brand: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: config.DB_MODEL_REF.BRAND,
    required: false
  }],
  attribute: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: config.DB_MODEL_REF.ATTRIBUTE,
    required: true
  }],
  averageRatings: {
    type: Number,
    min: [0, 'averageRatings must be positive.'],
    max: [5, 'average rating not more than 5.'],
    default: 0
  },
  reviewerCount: {
    type: Number,
    min: [0, 'reviewerCount must be positive.'],
    default: 0
  },
  bundleBuying: { type: Boolean, required: false, index: false },
  bundleDiscount: {
    type: Number,
    max: [0, 'bundleDiscount must be positive.']
  },
  subscriptionDiscount: {
    type: Number,
    max: [0, 'subscriptionDiscount must be positive.']
  },
  isSubscribable: { type: Boolean, required: false, default: false },
  status: {
    type: String,
    enum: [
      config.STATUS.BLOCKED,
      config.STATUS.UN_BLOCKED,
      config.STATUS.DELETED
    ],
    default: config.STATUS.UN_BLOCKED
  },
  dealOfTheDay: { type: Boolean, required: false, default: false },
  dealOfTheDayDiscount: {
    type: Number,
    max: [0, 'dealOfTheDayDiscount must be positive.']
  },
  salePrice: { type: Number, required: true, default: 0 },
  defaultPrice: { type: Number, required: false, default: 0 }, 
  isRefundable: { type: Boolean, required: true, default: true },
  refundPeriod: { type: Number, required: false, default: 0 },
  searchKeywords: [],
  isPublished: { type: Boolean, required: false, default: false },
  isFeatured: { type: Boolean, required: false, default: false },
  bookedCount: { type: Number, required: false, default: 0 },
  lastModifiedBy: modifiedBySchema,
  lastModifiedAt: { type: Date, required: false },
}, {
  versionKey: false,
  timestamps: true,

});

ServiceSchema.index({ "createdAt": -1, "name": 1 });

export let services: Model<IService> = mongoose.model<IService>(config.DB_MODEL_REF.SERVICE, ServiceSchema);
