import mongoose,{ Document, model, Model, Schema } from "mongoose";

import {
	DB_MODEL_REF,
	UPDATE_TYPE,
	SERVER,
} from "@config/index";
import { encryptHashPassword, genRandomString } from "@utils/appUtils";
import { sendMessageToFlock } from "@utils/FlockUtils";


export interface admins extends Document {//NOSONAR
	firstName?: string;
	lastName?: string;
	email: string;
	userType: string;
    mobileNo: string;
	status?: string;
	salt: string;
	hash: string;
	created: number;
}
;

const adminSchema: Schema = new mongoose.Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	firstName: { type: String, trim: true, required: false }, 
	lastName: { type: String, trim: true, required: false }, 
	email: { type: String, trim: true, required: true }, 
	userType: { type: String, trim: true, required: true },
	mobileNo: { type: String, trim: true, required: false }, 
	status: { type: String, trim: true, required: false, default: "UN_BLOCKED" },
    salt: { type: String, required: true },
	hash: { type: String, required: true },
	created: { type: Number, default: Date.now }
}, {
	versionKey: false,
	timestamps: true
});

// Load password virtually
adminSchema.virtual("password")
	.get(function () {
		return this._password;
	})
	.set(function (password) {
		this._password = password;
		const salt = this.salt = genRandomString(SERVER.SALT_ROUNDS);
		this.hash = encryptHashPassword(password, salt);
	});

// Export user
export const admins: Model<admins> = model<admins>(DB_MODEL_REF.ADMIN, adminSchema);