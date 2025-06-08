import mongoose, { Document, model, Model, Schema } from "mongoose";
import { DB_MODEL_REF, APPOINTMENT_STATUS } from "@config/index";
import { date } from "joi";


export interface IAppointment extends Document {
    userId:string;
    providerId?:string;
    serviceId:string;
    appointmentDate:Date;
    appointmentSlot:string;
    postalAddress: string;
    notes?:string;
    status:string
}

const appointmentSchema: Schema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId:{ type: Schema.Types.ObjectId, required: true },
    providerId: { type: String, trim: true, required: false },
    serviceId: { type: String, trim: true, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentSlot: { type: String, trim: true, required: true },
    postalAddress: { 
		addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        landmark: { type: String, required: false },
        city: {type: Number, require: true},
        pincode: { type: String, require: true},
        state: { type: Number, require: true},
        country: { type: Number, require: true},
		coordinates: { type: [Number], required: false } // [longitude, latitude]
	},
    notes: { type: String, require: false},
    status: {
        type: String,
		required: false,
		enum: Object.values(APPOINTMENT_STATUS)
    }}, 
    {
    versionKey: false,
    timestamps: true
});

export const appointments: Model<IAppointment> = model<IAppointment>(DB_MODEL_REF.APPOINTMENET, appointmentSchema);