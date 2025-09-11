/**
 * Filename: serviceTypeModel.ts
 * Purpose: Define Schema for Service Type Library
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";

import * as mongoose from "mongoose";
import { Model } from "mongoose";
import * as config from "@config/index";

let Schema = mongoose.Schema;

export interface IServiceType extends mongoose.Document {
  name: string;
  status: string;
}

let modifiedBySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: config.DB_MODEL_REF.USER,
  },
  email: { type: String, trim: true, lowercase: true, required: false },
  adminType: { type: String, trim: true, required: false }
}, { _id: false });

let ServiceTypeSchema = new Schema({
  name: { type: String, trim: true, required: true, unique: true },
  status: {
    type: String,
    enum: [
      config.STATUS.BLOCKED,
      config.STATUS.UN_BLOCKED,
      config.STATUS.DELETED
    ],
    default: config.STATUS.UN_BLOCKED
  },
  lastModifiedBy: modifiedBySchema,
  lastModifiedAt: { type: Date, required: false },
}, {
  versionKey: false,
  timestamps: true,
});

ServiceTypeSchema.index({ "status": 1 });

export let serviceTypes: Model<IServiceType> = mongoose.model<IServiceType>(config.DB_MODEL_REF.SERVICE_TYPE, ServiceTypeSchema);
