/**
 * Filename: serviceLocationModel.ts
 * Purpose: Define Schema for service-district mapping with pincode array and override flag
 * Owner: Secondservice
 * Maintainer: dothesmart
 */

"use strict";

import * as mongoose from "mongoose";
import { Model } from "mongoose";
import * as config from "@config/index";

export interface IPincodeConfig {
  pincode: string;
  officeName: string;
  isEnabled: boolean;
}

export interface IServiceLocation extends mongoose.Document {
  serviceId: mongoose.Types.ObjectId;
  districtName: string;
  stateName: string;
  isEnabled: boolean;
  isOverride: boolean; // Indicates if district has custom values or uses default service values
  // District-specific pricing and features (only used when isOverride = true)
  defaultPrice?: number;
  salePrice?: number;
  bundleBuying?: boolean;
  bundleDiscount?: number;
  isSubscribable?: boolean;
  subscriptionDiscount?: number;
  isRefundable?: boolean;
  refundPeriod?: number;
  dealOfTheDay?: boolean;
  dealOfTheDayDiscount?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  // Array of pincodes with their enable/disable status
  pincodes: IPincodeConfig[];
  lastModifiedBy: {
    userId: mongoose.Types.ObjectId;
    email: string;
    adminType: string;
  };
  lastModifiedAt: Date;
}

let pincodeConfigSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/
  },
  officeName: {
    type: String,
    required: true,
    trim: true
  },
  isEnabled: {
    type: Boolean,
    default: true,
    required: true
  }
}, { _id: false });

let modifiedBySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: config.DB_MODEL_REF.USER,
  },
  email: { type: String, trim: true, lowercase: true, required: false },
  adminType: { type: String, trim: true, required: false }
}, { _id: false });

let ServiceLocationSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: config.DB_MODEL_REF.SERVICE,
    required: true
  },
  districtName: {
    type: String,
    required: true,
    trim: true
  },
  stateName: {
    type: String,
    required: true,
    trim: true
  },
  isEnabled: {
    type: Boolean,
    default: true,
    required: true
  },
  isOverride: {
    type: Boolean,
    default: false,
    required: true
  },
  // 1. Pricing Configuration (District-specific, only used when isOverride = true)
  defaultPrice: {
    type: Number,
    min: [0, 'defaultPrice must be positive.']
  },
  salePrice: {
    type: Number,
    min: [0, 'salePrice must be positive.']
  },
  // 3. Bundle & Subscription Configuration (District-specific, only used when isOverride = true)
  bundleBuying: {
    type: Boolean
  },
  bundleDiscount: {
    type: Number,
    min: [0, 'bundleDiscount must be positive.'],
    max: [100, 'bundleDiscount cannot exceed 100%.']
  },
  isSubscribable: {
    type: Boolean
  },
  subscriptionDiscount: {
    type: Number,
    min: [0, 'subscriptionDiscount must be positive.'],
    max: [100, 'subscriptionDiscount cannot exceed 100%.']
  },
  // 4. Refund Configuration (District-specific, only used when isOverride = true)
  isRefundable: {
    type: Boolean
  },
  refundPeriod: {
    type: Number,
    min: [0, 'refundPeriod must be positive.']
  },
  // 5. Deal of the Day Configuration (District-specific, only used when isOverride = true)
  dealOfTheDay: {
    type: Boolean
  },
  dealOfTheDayDiscount: {
    type: Number,
    min: [0, 'dealOfTheDayDiscount must be positive.'],
    max: [100, 'dealOfTheDayDiscount cannot exceed 100%.']
  },
  // 6. Publication & Features Configuration (District-specific, only used when isOverride = true)
  isPublished: {
    type: Boolean
  },
  isFeatured: {
    type: Boolean
  },
  // Array of pincodes with their configuration
  pincodes: [pincodeConfigSchema],
  lastModifiedBy: modifiedBySchema,
  lastModifiedAt: { type: Date, required: false }
}, {
  versionKey: false,
  timestamps: true
});

// Indexes for efficient querying
ServiceLocationSchema.index({ serviceId: 1, districtName: 1, stateName: 1 }, { unique: true });
ServiceLocationSchema.index({ districtName: 1, stateName: 1 });
ServiceLocationSchema.index({ isEnabled: 1 });
ServiceLocationSchema.index({ isOverride: 1 });
ServiceLocationSchema.index({ isPublished: 1 });
ServiceLocationSchema.index({ "pincodes.pincode": 1 });

export let serviceLocations: Model<IServiceLocation> = mongoose.model<IServiceLocation>(
  "service_locations", 
  ServiceLocationSchema
);
