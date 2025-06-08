import _ from "lodash";
import crypto from "crypto";
import mongoose from "mongoose";
import promise from "bluebird";

import {
  buildToken,
  encryptHashPassword,
  getRandomOtp,
  getLocationByIp,
  matchPassword,
  matchOTP,
  encryptData,
} from "@utils/appUtils";
import {
  JOB_SCHEDULER_TYPE,
  STATUS,
  TOKEN_TYPE,
  SERVER,
  LOGIN_TYPE,
  USER_TYPE,
} from "@config/index";
import * as userConstant from "@modules/user/v1/userConstant";
import { userDaoV1 } from "@modules/user/index";
import { baseDao } from "@modules/baseDao/index";
import { loginHistoryDao } from "@modules/loginHistory/index";
import { redisClient } from "@lib/redis/RedisClient";
import { sendMessageToFlock } from "@utils/FlockUtils";
import { createToken } from "@lib/tokenManager";
import { mailManager } from "@lib/MailManager";
import { logger } from "@lib/logger";

export class UserController {
  /**
   * @function removeSession
   * @description remove the user session
   * @param params.userId
   * @param params.deviceId
   * @returns
   */
  async removeSession(params, isSingleSession: boolean) {
    try {
      if (isSingleSession)
        await loginHistoryDao.removeDeviceById({ userId: params.userId });
      else
        await loginHistoryDao.removeDeviceById({ userId: params.userId, deviceId: params.deviceId });

      if (SERVER.IS_REDIS_ENABLE) {
        if (isSingleSession) {
          let keys: any = await redisClient.getKeys(`*${params.userId}*`);
          keys = keys.filter(
            (v1) =>
              Object.values(JOB_SCHEDULER_TYPE).findIndex(
                (v2) => v2 === v1.split(".")[0]
              ) === -1
          );
          if (keys.length) await redisClient.deleteKey(keys);
        } else
          await redisClient.deleteKey(`${params.userId}.${params.deviceId}`);
      }
    } catch (error) {
      logger.error(error.stack);
      sendMessageToFlock({ title: "_removeSession", error: error.stack });
    }
  }

  /**
   * @function updateUserDataInRedis
   * @description update user's data in redis
   * @param params.salt
   * @param params.userId
   * @returns
   */
  async updateUserDataInRedis(params, isAlreadySaved = false) {
    try {
      delete params.salt;
      if (SERVER.IS_REDIS_ENABLE) {
        let keys: any = await redisClient.getKeys(
          `*${params.userId || params._id.toString()}*`
        );
        keys = keys.filter(
          (v1) =>
            Object.values(JOB_SCHEDULER_TYPE).findIndex(
              (v2) => v2 === v1.split(".")[0]
            ) === -1
        );
        const promiseResult = [],
          array = [];
        for (const key of keys) {
          if (isAlreadySaved) {
            let userData: any = await redisClient.getValue(
              `${params.userId || params._id.toString()}.${key.split(".")[1]}`
            );
            array.push(key);
            array.push(
              JSON.stringify(buildToken(_.extend(JSON.parse(userData), params)))
            );
            promiseResult.push(userData);
          } else {
            array.push(key);
            array.push(JSON.stringify(buildToken(params)));
          }
        }

        await Promise.all(promiseResult);
        if (array.length) redisClient.mset(array);
      }
      return {};
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function updateUserDataInDb
   * @description update user's data in login history
   * @param params._id
   * @returns
   */
  async updateUserDataInDb(params) {
    try {
      await baseDao.updateMany(
        "login_histories",
        { "userId._id": params._id },
        { $set: { userId: params } },
        {}
      );
      return {};
    } catch (error) {
      logger.error(error.stack);
      throw error;
    }
  }

  /**
   * @function signUp
   * @description signup of participant/supporter
   * @param params.email: user's email (required)
   * @param params.password: user's password (required)
   * @returns
   */
  async signUp(params: UserRequest.SignUp) {
    // MongoDB transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const isExist = await userDaoV1.isEmailExists(params); // to check is email already exists or not
      if (isExist) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
      else {
        const otp = getRandomOtp(4).toString();
        params["otp"] = otp
        await userDaoV1.signUp(params, session);
        await session.commitTransaction();
        session.endSession();
        return userConstant.MESSAGES.SUCCESS.SIGNUP({});
      }
    } catch (error) {
      // MongoDB transactions
      logger.error(error);
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * @function socialSignup
   * @description signup and login from user's social account (gmail or facebook)
   * @param params.email: user's email (required)
   * @param params.name
   * @param params.socialId
   * @param params.loginType
   * @param params.deviceId
   * @param params.deviceToken
   * @returns access token with data obj
   */
  async socialSignup(params: UserRequest.socialSignup) {
    try {
      if (!params.email) {
        const checkSocialIdExists = await this.getSocialIdExists(params);
        if (
          !checkSocialIdExists ||
          (checkSocialIdExists && !checkSocialIdExists.email)
        ) {
          return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_REQUIRED);
        }
        return this.handleUserSignupOrLogin(params);
      }

      const isEmailExist = await userDaoV1.isEmailExists(params);
      if(!isEmailExist){
       return this.handleUserSignupTransaction(params)
      }
      if (params.email && isEmailExist) {
        let maxLoginExceed = await this.checkMaxLogins({
          userId: isEmailExist._id,
        });
        if (maxLoginExceed){
          return Promise.reject(userConstant.MESSAGES.ERROR.EXCEED_MAX_LOGINS);
        }
        return this.handleExistingUser(params, isEmailExist);
      }

      return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_REQUIRED);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  private async handleUserSignupOrLogin(params: UserRequest.socialSignup) {
    const isSocialIdExists = await userDaoV1.isSocialIdExists(params);
    if (!isSocialIdExists) {
      return this.handleUserSignupTransaction(params);
    }
    let maxLoginExceed = await this.checkMaxLogins({
      userId: isSocialIdExists._id,
    });
    if (maxLoginExceed) return Promise.reject(userConstant.MESSAGES.ERROR.EXCEED_MAX_LOGINS);
    await userDaoV1.updateSocialData(params, isSocialIdExists);
    const step1 = await userDaoV1.findUserById(isSocialIdExists._id);
    return this.handleUserLogin(step1, params);
  }

  private async handleUserSignupTransaction(params: UserRequest.socialSignup) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      params["socialData.socialId"] = params.socialId;
      params["socialData.email"] = params.email ? params.email : "";
      if (params?.name) params["socialData.name"] = params.name;
      if (params?.profilePicture)
        params["socialData.profilePicture"] = params.profilePicture;

      const step1 = await this.signupUser(params, session);

      return this.handleUserSignup(step1, params);
    } finally {
      session.endSession();
    }
  }

  /**
   * @function sendOTP
   * @description send/resend otp on email/phone number
   * @param params.type
   * @param params.email: user's email (required)
   * @param params.mobileNo (optional)
   * @returns
   */
  async sendOTP(params: UserRequest.SendOtp) {
    try {
      const step1 = await userDaoV1.isEmailExists(params);
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      if (step1?.status === STATUS.BLOCKED)
        return Promise.reject(userConstant.MESSAGES.ERROR.BLOCKED);
      const otp = getRandomOtp(4).toString();
      let otpLimitCount = 1;
      console.log(otp);
      if (params.type === "EMAIL") {
        let step2: any = await redisClient.getValue(params.email);
        if (step2) {
          otpLimitCount = await this.restrictOTP(step2, otpLimitCount);
        }
        if (SERVER.IS_REDIS_ENABLE) redisClient.setExp(params.email, SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL / 1000, JSON.stringify({ email: params.email, otp: otp, count: otpLimitCount }));
        mailManager.forgotPasswordMail({ email: params.email, otp,name:step1.firstName });
      } else {
        const isExist = await userDaoV1.isMobileExists({ countryCode: "61", ...params }, step1._id);
        if (isExist)
          return Promise.reject(userConstant.MESSAGES.ERROR.MOBILE_NO_ALREADY_EXIST);

        await baseDao.updateOne(
          "users",
          { email: params.email },
          {
            $set: {
              countryCode: "61",
              mobileNo: params.mobileNo,
              fullMobileNo: "61" + params.mobileNo,
            },
          },
          {}
        );
        if (SERVER.IS_REDIS_ENABLE)
          redisClient.setExp(
            "61" + params.mobileNo,
            SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_MOBILE / 1000,
            JSON.stringify({
              countryCode: "61",
              mobileNo: params.mobileNo,
              otp: otp,
            })
          );
      }
      return userConstant.MESSAGES.SUCCESS.SEND_OTP;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function verifyOTP
   * @description verify otp on forgot password/verify number
   * @param params.type
   * @param params.email: user's email (required)
   * @param params.mobileNo
   * @param params.otp: otp (required)
   * @param params.deviceId
   * @param params.deviceToken
   * @returns accessToken and data obj
   */
  async verifyOTP(params: UserRequest.VerifyOTP) {
    try {
      const step1 = await userDaoV1.isEmailExists(params);
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      if (step1.status == STATUS.BLOCKED)
        return Promise.reject(userConstant.MESSAGES.ERROR.BLOCKED);
      let step2;
      if (params.type === "EMAIL") {
        step2 = await redisClient.getValue(params.email);
      } else {
        step2 = await redisClient.getValue("61" + params.mobileNo);
      }

      const isOTPMatched = await matchOTP(params.otp, step2);
      if (!isOTPMatched) {
        let count = 1;
        let invlidOTPcount: any = await redisClient.getValue(
          `${step1._id.toString()}`
        );
        if (invlidOTPcount) {
          if (invlidOTPcount >= process.env.INVALID_OTP_COUNT) {
            await userDaoV1.updateOne("users", { _id: step1._id }, { status: STATUS.BLOCKED }, {});
            await loginHistoryDao.updateMany("login_histories", { "userId._id": step1._id, "isLogin": true }, { "isLogin": false }, {})
            const payload1 = {
              jobName: JOB_SCHEDULER_TYPE.TEMPORARY_ACCOUNT_BLOCKED,
              time:
                new Date(Date.now()).getTime() +
                SERVER.TOKEN_INFO.EXPIRATION_TIME.BLOCKED_ACCOUNT,
              data: { userId: step1._id },
            };
            redisClient.createJobs(payload1);
          }
          count = parseInt(invlidOTPcount) + 1;
        }
        redisClient.setExp(
          `${step1._id.toString()}`,
          SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL / 1000,
          count
        );
        return Promise.reject(userConstant.MESSAGES.ERROR.INVALID_OTP);
      }
      let encEmail = await encryptData(params.email);
      if (SERVER.IS_REDIS_ENABLE) redisClient.setExp(encEmail, SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL / 1000, JSON.stringify({ email: step1.email }));

      let dataToReturn = {};

      if (params.type === "MOBILE") {
        await baseDao.updateOne(
          "users",
          { email: params.email },
          { $set: { isMobileVerified: true } },
          {}
        );

        const salt = crypto.randomBytes(64).toString("hex");
        const tokenData = {
          userId: step1._id,
          deviceId: params.deviceId,
          accessTokenKey: salt,
          type: TOKEN_TYPE.USER_LOGIN,
          userType: step1.userType,
        };
        const location = await getLocationByIp(params.remoteAddress); // get location (timezone, lat, lng) from ip address
        const [accessToken] = await promise.join(
          createToken(tokenData),
          loginHistoryDao.createUserLoginHistory({
            ...params,
            ...step1,
            salt,
            location,
          })
        );
        if (SERVER.IS_REDIS_ENABLE)
          redisClient.setExp(
            `${step1._id.toString()}.${params.deviceId}`,
            Math.floor(
              SERVER.TOKEN_INFO.EXPIRATION_TIME[TOKEN_TYPE.USER_LOGIN] / 1000
            ),
            JSON.stringify(buildToken({ ...step1, ...params, salt }))
          );

        dataToReturn = {
          accessToken,
          userId: step1._id,
          email: step1.email,
          userType: step1.userType,
          mobileNo: step1?.mobileNo,
          profilePicture: "",
        };
      }
      dataToReturn["encEmail"] = encEmail;
      return userConstant.MESSAGES.SUCCESS.VERIFY_OTP(dataToReturn);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function login
   * @description signup of participant/supporter
   * @param params.email: user's email (required)
   * @param params.password: user's password (required)
   * @param params.deviceId: device id (required)
   * @param params.deviceToken: device token (required)
   * @retuns data obj with token
   */
  async login(params: UserRequest.Login) {
    try {
      const step1 = await userDaoV1.isEmailExists(params);
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      if (step1.status === STATUS.BLOCKED)
        return Promise.reject(userConstant.MESSAGES.ERROR.BLOCKED);
      const isPasswordMatched = await matchPassword(
        params.password,
        step1.hash,
        step1.salt
      );
      if (!isPasswordMatched)
        return Promise.reject(userConstant.MESSAGES.ERROR.INCORRECT_PASSWORD);
      // else if (!step1.isMobileVerified) return Promise.reject(userConstant.MESSAGES.ERROR.MOBILE_NO_NOT_VERIFIED);
      else {
        let maxLoginExceed = await this.checkMaxLogins({ userId: step1._id });
        if (maxLoginExceed)
          return Promise.reject(userConstant.MESSAGES.ERROR.EXCEED_MAX_LOGINS);
        await this.removeSession(
          { userId: step1._id, deviceId: params.deviceId },
          false
        );
        const salt = crypto.randomBytes(64).toString("hex");
        const tokenData = {
          userId: step1._id,
          deviceId: params.deviceId,
          accessTokenKey: salt,
          type: TOKEN_TYPE.USER_LOGIN,
          userType: step1.userType,
        };
        const location = await getLocationByIp(params.remoteAddress); // get location (timezone, lat, lng) from ip address
        const [accessToken] = await promise.join(
          createToken(tokenData),
          loginHistoryDao.createUserLoginHistory({
            ...params,
            ...step1,
            salt,
            location,
          })
        );
        if (SERVER.IS_REDIS_ENABLE)
          redisClient.setExp(
            `${step1._id.toString()}.${params.deviceId}`,
            Math.floor(
              SERVER.TOKEN_INFO.EXPIRATION_TIME[TOKEN_TYPE.USER_LOGIN] / 1000
            ),
            JSON.stringify(buildToken({ ...step1, ...params, salt }))
          );

        step1._id.toString();

        return userConstant.MESSAGES.SUCCESS.LOGIN({
          accessToken,
          userId: step1._id,
          email: step1.email,
          userType: step1.userType,
          firstName: step1?.firstName,
          lastName: step1?.lastName,
          gender: step1?.gender,
          profilePicture: step1?.profilePicture,
          dob: step1?.dob,
          mobileNo: step1?.mobileNo,
        });
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function forgotPassword
   * @description send OTP when user forgot password
   * @param params.email: user's email (required)
   * @returns
   */
  async forgotPassword(params: UserRequest.ForgotPassword) {
    try {
      const step1 = await userDaoV1.isEmailExists(params); // check is email exist if not then restrict to send forgot password mail
      console.log("step1==============", step1);
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      else if (step1.status === STATUS.BLOCKED)
        return Promise.reject(userConstant.MESSAGES.ERROR.BLOCKED);
      else {
        let otp = getRandomOtp(4).toString();
        console.log(otp);
        let otpLimitCount = 1;
        let step2: any = await redisClient.getValue(params.email);
        if (step2) {
          otpLimitCount = await this.restrictOTP(step2, otpLimitCount);
        }
        if (SERVER.IS_REDIS_ENABLE)
          redisClient.setExp(
            params.email,
            SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL / 1000,
            JSON.stringify({
              email: params.email,
              otp: otp,
              count: otpLimitCount,
            })
          );
        await mailManager.forgotPasswordMail({
          email: params.email,
          name: step1.firstName,
          otp: otp,
        });
        return userConstant.MESSAGES.SUCCESS.SEND_OTP;
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function resetPassword
   * @description update user new password in DB
   * @param params.email: user's email (required)
   * @param params.newPassword: new password
   * @param params.confirmPassword: confirmation of new password
   * @returns
   */
  async resetPassword(params: UserRequest.ChangeForgotPassword) {
    try {
      if (params.newPassword !== params.confirmPassword)
        return Promise.reject(userConstant.MESSAGES.ERROR.NEW_CONFIRM_PASSWORD);
      let data: any = await redisClient.getValue(params.encryptedToken);
      data = JSON.parse(data)
      if (!data || data == null) return Promise.reject(userConstant.MESSAGES.ERROR.TOKEN_EXPIRED);
      let email = data.email;
      const step1 = await userDaoV1.isEmailExists({ email: email }); // check is email exist if not then restrict to send forgot password mail
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      params.email = email;
      params.hash = encryptHashPassword(params.newPassword, step1.salt);
      await userDaoV1.changePassword(params);
      return userConstant.MESSAGES.SUCCESS.RESET_PASSWORD;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function logout
   * @description remove/end the user session
   * @param tokenData
   * @returns
   */
  async logout(tokenData: TokenData) {
    try {
      await this.removeSession(tokenData, false);
      return userConstant.MESSAGES.SUCCESS.USER_LOGOUT;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function profile
   * @description user can get the profile details by userid
   * @param params.userId
   * @returns User's details obj
   */
  async profile(params: UserId, tokenData: TokenData) {
    try {
      const step1 = await userDaoV1.findUserById(
        params.userId || tokenData.userId
      );
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.USER_NOT_FOUND);
      let profileData = {};
      console.log(step1, "step1");
      if (step1._id) profileData["_id"] = step1._id;
      if (step1.firstName) profileData["firstName"] = step1.firstName;
      if (step1.lastName) profileData["lastName"] = step1.lastName;
      if (step1.email) profileData["email"] = step1.email;
      if (step1.status) profileData["status"] = step1.status;
      if (step1.userType) profileData["userType"] = step1.userType;
      if (step1.name) profileData["name"] = step1.name;
      if (step1.profilePicture)
        profileData["profilePicture"] = step1.profilePicture;
      if (step1.socialData) profileData["socialData"] = step1.socialData;
      if (step1.loginType) profileData["loginType"] = step1.loginType;
      return userConstant.MESSAGES.SUCCESS.PROFILE(profileData);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  // Functions for social signup

  private async getSocialIdExists(params: UserRequest.socialSignup) {
    if (params.loginType === LOGIN_TYPE.GOOGLE) {
      return await userDaoV1.findOne("users", {
        googleSocialId: params.socialId,
        status: STATUS.UN_BLOCKED,
      });
    }
    if (params.loginType === LOGIN_TYPE.APPLE) {
      return await userDaoV1.findOne("users", {
        appleSocialId: params.socialId,
        status: STATUS.UN_BLOCKED,
      });
    }
    return null;
  }

  private async handleExistingUser(
    params: UserRequest.socialSignup,
    isEmailExist: any
  ) {
    const step1 = await userDaoV1.updateSocialData(params, isEmailExist);
    const salt = crypto.randomBytes(64).toString("hex");
    const tokenData = {
      userId: step1._id,
      deviceId: params.deviceId,
      accessTokenKey: salt,
      type: TOKEN_TYPE.USER_LOGIN,
      userType: USER_TYPE.USER,
    };

    const [accessToken] = await promise.join(
      createToken(tokenData),
      loginHistoryDao.createUserLoginHistory({ ...step1, ...params, salt })
    );

    if (SERVER.IS_REDIS_ENABLE) {
      redisClient.setExp(
        `${step1._id.toString()}.${params.deviceId}`,
        Math.floor(
          SERVER.TOKEN_INFO.EXPIRATION_TIME[TOKEN_TYPE.USER_LOGIN] / 1000
        ),
        JSON.stringify(buildToken({ ...step1, ...params, salt }))
      );
    }

    return userConstant.MESSAGES.SUCCESS.LOGIN({
      accessToken,
      _id: step1._id,
      name: step1 ? step1.name : "",
      firstName: step1?.firstName,
      lastName: step1?.lastName,
      email: step1.email,
      profilePicture: step1?.profilePicture,
      phoneNumber: step1?.phoneNumber,
      socialData: step1.socialData ? step1.socialData : "",
      loginType: params.loginType,
    });
  }

  private async signupUser(params: UserRequest.socialSignup, session: any) {
    params["socialData.socialId"] = params.socialId;
    params["socialData.email"] = params.email ? params.email : "";
    if (params.name) params["socialData.name"] = params.name;
    if (params?.profilePicture)
      params["socialData.profilePicture"] = params.profilePicture;

    const step1 = await userDaoV1.signUp(params, session);
    return step1;
  }

  private async handleUserSignup(step1: any, params: UserRequest.socialSignup) {
    const salt = crypto.randomBytes(64).toString("hex");
    const tokenData = {
      userId: step1._id,
      deviceId: params.deviceId,
      accessTokenKey: salt,
      type: TOKEN_TYPE.USER_LOGIN,
      userType: USER_TYPE.USER,
    };

    const [accessToken] = await promise.join(
      createToken(tokenData),
      loginHistoryDao.createUserLoginHistory({ ...step1, ...params, salt })
    );

    if (SERVER.IS_REDIS_ENABLE) {
      redisClient.setExp(
        `${step1._id.toString()}.${params.deviceId}`,
        Math.floor(
          SERVER.TOKEN_INFO.EXPIRATION_TIME[TOKEN_TYPE.USER_LOGIN] / 1000
        ),
        JSON.stringify(buildToken({ ...step1, ...params, salt }))
      );
    }

    return userConstant.MESSAGES.SUCCESS.SIGNUP({
      accessToken,
      _id: step1._id,
      name: step1.name ? step1.name : "",
      firstName: step1?.firstName,
      lastName: step1?.lastName,
      email: step1.email,
      profilePicture: step1?.profilePicture,
      phoneNumber: step1?.phoneNumber,
    });
  }

  private async handleUserLogin(step1: any, params: UserRequest.socialSignup) {
    const salt = crypto.randomBytes(64).toString("hex");
    const tokenData = {
      userId: step1._id,
      deviceId: params.deviceId,
      accessTokenKey: salt,
      type: TOKEN_TYPE.USER_LOGIN,
      userType: USER_TYPE.USER,
    };

    await baseDao.updateMany("login_histories", { deviceToken: params.deviceToken, isLogin: true }, { isLogin: false }, {});

    const [accessToken] = await promise.join(
      createToken(tokenData),
      loginHistoryDao.createUserLoginHistory({ ...step1, ...params, salt })
    );

    if (SERVER.IS_REDIS_ENABLE) {
      redisClient.setExp(
        `${step1._id.toString()}.${params.deviceId}`,
        Math.floor(
          SERVER.TOKEN_INFO.EXPIRATION_TIME[TOKEN_TYPE.USER_LOGIN] / 1000
        ),
        JSON.stringify(buildToken({ ...step1, ...params, salt }))
      );
    }

    return userConstant.MESSAGES.SUCCESS.LOGIN({
      accessToken,
      _id: step1._id,
      name: step1.name ? step1.name : "",
      firstName: step1?.firstName,
      lastName: step1?.lastName,
      email: step1.email,
      profilePicture: step1?.profilePicture,
      phoneNumber: step1?.phoneNumber,
    });
  }

  /**
   * @function checkMaxLogins
   * @description check the maximum number of login devices
   * @param params.userId
   * @returns true/false
   */
  async checkMaxLogins(params) {
    try {
      let loginCount = await loginHistoryDao.activeLoginCount({
        userId: params.userId,
      });
      if (loginCount >= process.env.MAX_LOGIN_COUNT) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async restrictOTP(params, count) {
    try {
      let step1 = JSON.parse(params);
      let otpLimitCount = count + step1.count;
      if (otpLimitCount > +process.env.MAX_OTP_LIMIT)
        return Promise.reject(userConstant.MESSAGES.ERROR.EXCEED_OTP_LIMIT);
      return otpLimitCount;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * @function updateStatus
   * @description update user's status  in DB
   * @param params.email: user's email (required)
   * @param params.status: user's new status
   * @returns
   */
  async updateStatus(params: UserRequest.updateStatus) {
    try {

      const step1 = await userDaoV1.isEmailExists(params);
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      await userDaoV1.updateStatus(params, step1);
      if (params.status == STATUS.BLOCKED) {
        return userConstant.MESSAGES.SUCCESS.BLOCK_USER;
      } else {
        return userConstant.MESSAGES.SUCCESS.UNBLOCK_USER;
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }


  /**
   * @function verifySignUp
   * @description verify otp on forgot password/verify number
   * @param params.userId userId of temp signup data
   * @param params.otp: otp (required)
   * @returns 
   */
  async verifySignUp(params: UserRequest.verifySignUp) {
    try {
      let tempUserExists : any = await baseDao.findOne("pre_signup", {"_id": params.userId})
      if(!tempUserExists || params.otp !== tempUserExists.otp ){
        return Promise.reject(userConstant.MESSAGES.ERROR.OTP_EXPIRED);
      }else{
        let userData = {
          "firstName":tempUserExists.firstName,
          "lastName":tempUserExists.lastName,
          "email":tempUserExists.email,
          "salt": tempUserExists.salt,
          "hash": tempUserExists.hash
        }
        this.signUp(userData)
        return userConstant.MESSAGES.SUCCESS.SIGNUP({});
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
 * @function tempSignUp
 * @description temporary signup of participant/supporter
 * @param params.email: user's email (required)
 * @param params.password: user's password (required)
 * @returns
 */
  async tempSignUp(params: UserRequest.SignUp) {
    try {
      const isExist = await userDaoV1.isEmailExists(params); // to check is email already exists or not
      if (isExist) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
      else {
        const otp = getRandomOtp(4).toString();
        params["otp"] = otp
        let tmpUserData = await userDaoV1.tempSignUp(params);
        // this.sendOTP({type:"EMAIL", email:tmpUserData.email})
        mailManager.tempSignUp({ email: params.email, otp ,name:params.firstName});
        return userConstant.MESSAGES.SUCCESS.VERIFY_ACCOUNT({"userId": tmpUserData._id });
      }
    } catch (error) {
      // MongoDB transactions
      logger.error(error);
      throw error;
    }
  }

  /**
     * @function changePassword
     * @description update user new password in DB
     * @param params.oldPassword: user's old password (required)
     * @param params.newPassword: new password
     * @returns
     */
  async changePassword(params:UserRequest.ChangePassword,tokenData) {
    try {
      if (params.newPassword === params.oldPassword)return Promise.reject(userConstant.MESSAGES.ERROR.SAME_PASSWORD);

      const step1 = await userDaoV1.isEmailExists({ email: tokenData.email }); // check is email exist / not
      if (!step1) return Promise.reject(userConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      
      if(encryptHashPassword(params.oldPassword, step1.salt)==step1.hash){
        params.hash=encryptHashPassword(params.newPassword, step1.salt);
        delete params.oldPassword;
        await userDaoV1.changePasswords(params,tokenData.userId);
        return userConstant.MESSAGES.SUCCESS.RESET_PASSWORD;        
      }else{
        return Promise.reject(userConstant.MESSAGES.ERROR.MATCH_OLD_PASSWORD);
      }

    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
export const userController = new UserController();
