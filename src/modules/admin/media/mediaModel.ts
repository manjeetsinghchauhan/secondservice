/**
 * Filename: mediaModel.ts
 * Purpose: Define Schema for Media Library
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";

import * as mongoose from "mongoose";
import { Model } from "mongoose";
import * as config from "@config/index";
import { describe } from "node:test";

let Schema = mongoose.Schema;
export interface IMedia extends mongoose.Document {
  name: string;
  status: string;
  media: string;
}

let pageInfo = new Schema({
  page: { type: Number, default: 0, required: false },
  limit: { type: Number, default: 0, required: false },
})

export let serviceMedia = new Schema({
  url: { type: String, trim: true, required: true, index: false },
  type: {
    type: String,
    enum: [
      config.MEDIA_TYPE.IMAGE,
      config.MEDIA_TYPE.VIDEO
    ],
    default: config.MEDIA_TYPE.IMAGE
  },
  key: { type: String, trim: true, required: false }
}, { _id: false })

let modifiedBySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: config.DB_MODEL_REF.USER,
  },
  email: { type: String, trim: true, lowercase: true, required: false },
  adminType: { type: String, trim: true, required: false }
}, { _id: false });


let MediaSchema = new Schema({
  name: { type: String, trim: true, required: true, index: false },
  media: [serviceMedia],
  status: {
    type: String,
    enum: [
      config.STATUS.BLOCKED,
      config.STATUS.UN_BLOCKED,
      config.STATUS.DELETED
    ],
    default: config.STATUS.UN_BLOCKED
  },
  searchKeywords: [],
  lastModifiedBy: modifiedBySchema,
  lastModifiedAt: { type: Date, required: false },
}, {
  versionKey: false,
  timestamps: true,

});

MediaSchema.index({ "searchKeywords": 1, "name": 1 });

export let medias: Model<IMedia> = mongoose.model<IMedia>(config.DB_MODEL_REF.MEDIA, MediaSchema);
