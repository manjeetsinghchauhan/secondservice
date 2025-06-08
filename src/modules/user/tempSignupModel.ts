import mongoose,{ Document, model, Model, Schema } from "mongoose";

import {
	DB_MODEL_REF,
	UPDATE_TYPE,
	SERVER,
} from "@config/index";
import { encryptHashPassword, genRandomString } from "@utils/appUtils";
import { sendMessageToFlock } from "@utils/FlockUtils";
import { userControllerV1 } from "@modules/user/index";


export interface tempSignup extends Document {//NOSONAR
	name?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	salt: string;
	hash: string;
	created: number;
	otp: string;
}
;

const preSignupSchema: Schema = new mongoose.Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	name: { type: String, trim: true, required: false }, // for both (participant/supporter)
	firstName: { type: String, trim: true, required: false }, // for both (participant/supporter)
	lastName: { type: String, trim: true, required: false }, // for both (participant/supporter)
	email: { type: String, trim: true, required: true }, // for both (participant/supporter)
	salt: { type: String, required: true },
	hash: { type: String, required: true },
	created: { type: Number, default: Date.now },
	otp:{type: String, required: true},
	ttl: { type: Date, default: Date.now }
}, {
	versionKey: false,
	timestamps: true
});

// Load password virtually
preSignupSchema.virtual("password")
	.get(function () {
		return this._password;
	})
	.set(function (password) {
		this._password = password;
		const salt = this.salt = genRandomString(SERVER.SALT_ROUNDS);
		this.hash = encryptHashPassword(password, salt);
	});

preSignupSchema.post("save", async function (doc) {
	setTimeout(() => {
	}, 10);
});

/**
 * @function _updateDataInModels
 */
const _updateDataInModels = async (doc) => {
	try {
		switch (doc["updateType"]) {
			case UPDATE_TYPE.BLOCK_UNBLOCK:
			case UPDATE_TYPE.APPROVED_DECLINED:
			case UPDATE_TYPE.SET_PROFILE_PIC:
			case UPDATE_TYPE.ABOUT_ME: {
				await userControllerV1.updateUserDataInRedis(doc, true);
				await userControllerV1.updateUserDataInDb(doc);
				break;
			}
			case UPDATE_TYPE.EDIT_PROFILE: {
				await userControllerV1.updateUserDataInRedis(doc, true);
				break;
			}
		}
	} catch (error) {
		sendMessageToFlock({ "title": "_updateDataInUserModel", "error": { error, "userId": doc["_id"] } });
	}
};

preSignupSchema.post("findOneAndUpdate", function (doc) {

	setTimeout(() => {
		_updateDataInModels(doc);
	}, 10);
});

preSignupSchema.index({ firstName: 1 });
preSignupSchema.index({ lastName: 1 });
preSignupSchema.index({ name: 1 });
preSignupSchema.index({ email: 1 });
preSignupSchema.index({ ttl: 1 }, { expireAfterSeconds: 120 });

// Export user
export const pre_signup: Model<tempSignup> = model<tempSignup>(DB_MODEL_REF.PRESIGNUP, preSignupSchema);