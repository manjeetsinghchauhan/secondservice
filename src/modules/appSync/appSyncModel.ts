import mongoose, { Document, model, Model, Schema } from "mongoose";
import { DB_MODEL_REF } from "@config/index";


export interface IAppSync extends Document {
    userId:string;
    contactImage:string;
    firstName:string;
    lastName:string;
    countryCode:string;
    mobileNo:string;
    email:string;
}

const appSyncSchema: Schema = new mongoose.Schema({
    userId:{ type: Schema.Types.ObjectId, required: false },
    firstName: { type: String, trim: true, required: false },
    lastName: { type: String, trim: true, required: false },
    contactImage: { type: String, required: false },
    countryCode: { type: String, trim: true, required: false },
    mobileNo: { type: String, required: false },
    email: { type: String, trim: true, required: false },
    created: { type: Number, default: Date.now }
}, {
    versionKey: false,
    timestamps: true
});

export const appsyncs: Model<IAppSync> = model<IAppSync>(DB_MODEL_REF.APP_SYNC, appSyncSchema);