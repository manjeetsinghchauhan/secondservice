import mongoose,{ Document, model, Model, Schema } from "mongoose";

import {
	DB_MODEL_REF,
	GENDER,
	UPDATE_TYPE,
	STATUS,
	USER_TYPE,
	LOGIN_TYPE
} from "@config/index";
import { sendMessageToFlock } from "@utils/FlockUtils";
import { userControllerV1 } from "@modules/user/index";


export interface IUser extends Document {
	name?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	isApproved: boolean;
	salt: string;
	hash: string;
	gender?: string;
	profilePicture?: string;
	dob?: number;
	language?: string;
	countryCode?: string;
	mobileNo?: string;
	fullMobileNo?: string;
	isMobileVerified: boolean;
	location?: GeoLocation;
	status: string;
	created: number;
	platform: string;
	userType: string;
	googleSocialId:string;
    appleSocialId:string;
}

const geoSchema: Schema = new mongoose.Schema({
	type: { type: String, default: "Point" },
	address: { type: String, required: true },
	coordinates: { type: [Number], index: "2dsphere", required: true } // [longitude, latitude]
}, {
	_id: false
});

const socialDataSchema = new Schema({
	profilePic: { type: String, required: false, default: "" },
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	socialId: { type: String, required: false },
	email: { type: String, trim: true, lowercase: true },
	phoneNumber: { type: String, trim: true }
})

const userSchema: Schema = new mongoose.Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	name: { type: String, trim: true, required: false }, // for both (participant/supporter)
	firstName: { type: String, trim: true, required: false }, // for both (participant/supporter)
	lastName: { type: String, trim: true, required: false }, // for both (participant/supporter)
	email: { type: String, trim: true, required: true }, // for both (participant/supporter)
	isApproved: { type: Boolean, default: true }, // for both (participant/supporter) (for approval of documents)
	socialData: socialDataSchema,

	salt: { type: String, required: false },
	hash: { type: String, required: false },
	gender: { // for both (participant/supporter)
		type: String,
		required: false,
		enum: Object.values(GENDER)
	},
	profilePicture: { type: String, required: false }, // for both (participant/supporter) (Step 3)
	dob: { type: Number, required: false }, // for both (participant/supporter)
	language: { type: String, required: false }, // for both (participant/supporter)
	interpreterRequired: { type: Boolean }, // for both (participant/supporter)
	identifyAsAboriginal: { type: Boolean }, // for both (participant/supporter)
	countryCode: { type: String, required: false },
	mobileNo: { type: String, required: false },
	fullMobileNo: { type: String, required: false },
	isMobileVerified: { type: Boolean, default: false }, // for both (participant/supporter)
	location: geoSchema, // for both (participant/supporter)

	postalAddress: { // for both (participant/supporter)
		address: { type: String, required: false },
		coordinates: { type: [Number], required: false } // [longitude, latitude]
	},
	pushNotificationStatus: { type: Boolean, default: true }, // for inapp notifications
	status: {
		type: String,
		enum: [STATUS.BLOCKED, STATUS.UN_BLOCKED, STATUS.DELETED],
		default: STATUS.UN_BLOCKED
	},
	loginType:{type:String,requred:true,default:LOGIN_TYPE.NORMAL},
	googleSocialId: { type: String, required: false },
	appleSocialId: { type: String, required: false },
	platform:{ type: String, required: false },
	userType:{ type: String, required: false, default:USER_TYPE.USER },
	created: { type: Number, default: Date.now }
}, {
	versionKey: false,
	timestamps: true
});

// Load password virtually
// userSchema.virtual("password")
// 	.get(function () {
// 		return this._password;
// 	})
// 	.set(function (password) {
// 		this._password = password;
// 		const salt = this.salt = genRandomString(SERVER.SALT_ROUNDS);
// 		this.hash = encryptHashPassword(password, salt);
// 	});

userSchema.post("save", async function (doc) {
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

userSchema.post("findOneAndUpdate", function (doc) {

	setTimeout(() => {
		_updateDataInModels(doc);
	}, 10);
});

userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ name: 1 });
userSchema.index({ email: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ mobileNo: 1 });
userSchema.index({ status: 1 });
userSchema.index({ created: -1 });

// Export user
export const users: Model<IUser> = model<IUser>(DB_MODEL_REF.USER, userSchema);