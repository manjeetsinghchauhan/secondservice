/**
 * Filename: pincodeModel.ts
 * Purpose: Define Schema for pincode
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";

import * as mongoose from "mongoose";
import { Model } from "mongoose";
import * as config from "@config/index";
import { describe } from "node:test";

let Schema = mongoose.Schema;
export interface IPincode extends mongoose.Document {
  officeName: String;
  pincode: String;
  officeType: String;
  deliveryStatus: String;
  divisionName: String;
  regionName: String;
  circleName: String;
  taluk: String;
  districtName: String;
  stateName: String; 
}

let pageInfo = new Schema({
  page: { type: Number, default: 0, required: false },
  limit: { type: Number, default: 0, required: false },
})

let PincodeSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/
  },
  officeType: {
    type: String,
    enum: ['HO', 'SO', 'BO'],
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['Delivery', 'Non-Delivery'],
    required: true
  },
  divisionName: {
    type: String,
    required: true
  },
  regionName: {
    type: String,
    required: true
  },
  circleName: {
    type: String,
    required: true
  },
  taluk: {
    type: String,
    required: false
  },
  districtName: {
    type: String,
    required: true
  },
  stateName: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,

});

PincodeSchema.index({ pincode: 1 });
PincodeSchema.index({ stateName: 1 });
PincodeSchema.index({ districtName: 1 });

export let pincodes: Model<IPincode> = mongoose.model<IPincode>(config.DB_MODEL_REF.PINCODE, PincodeSchema);