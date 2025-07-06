import mongoose,{ Document, model, Model, Schema } from "mongoose";

import {
	DB_MODEL_REF,
	UPDATE_TYPE,
	STATUS,
	USER_TYPE,
	LOGIN_TYPE
} from "@config/index";
import { sendMessageToFlock } from "@utils/FlockUtils";


export interface IAdmin extends mongoose.Document {
    name: string;
    email: string;
    salt: string;
    hash: string;
    adminType: string;
    profilePicture: string;
    permission: Permissions;
    status: string;
  }

  const permissionSchema = new Schema({

    PATH: { type: String, trim: true },
    PUT: {
      type: Boolean,
      default: false
    },
    POST: {
      type: Boolean,
      default: false
    }
  
  }, { _id: false });

  const modifiedBySchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: DB_MODEL_REF.ADMIN,
    },
    //name: { type: String, trim: true, required: false },
    email: { type: String, trim: true, lowercase: true, required: false },
    adminType: { type: String, trim: true, required: false }
  }, { _id: false })

  const adminSchema = new Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, index: true, lowercase: true, required: true },
    image: { type: String, trim: true },
    salt: { type: String, required: false },
    hash: { type: String, required: false },
    token: { type: String },
    tokenCreated: { type: Date },
    adminType: { type: String, default: USER_TYPE.ADMIN },
    profilePicture: { type: String },
    permission: [permissionSchema],
    status: {
      type: String,
      enum: [
        STATUS.BLOCKED,
        STATUS.UN_BLOCKED,
        STATUS.DELETED
      ],
      default: STATUS.UN_BLOCKED
    },
    lastModifiedBy: modifiedBySchema
  }, {
      versionKey: false,
      timestamps: true,
    });


// Export user
export const admins: Model<IAdmin> = model<IAdmin>(DB_MODEL_REF.ADMIN, adminSchema);