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
import * as adminConstant from "@modules/admin/admin/adminConstant";
import { adminDao } from "@modules/admin/admin/index";
import { baseDao } from "@modules/baseDao/index";
import { createToken } from "@lib/tokenManager";
import { logger } from "@lib/logger";
import { loginHistoryDao } from "@modules/loginHistory/index";
import { redisClient } from "@lib/redis/RedisClient";

export class AdminController {

      /**
 * @function signUp
 * @description signup of admin/sub-admin
 * @param params.email: user's email (required)
 * @param params.password: user's password (required)
 * @returns
 */
  async signUp(params: UserRequest.SignUp) {
    try {
      const isExist = await adminDao.isEmailExists(params); // to check is email already exists or not
      if (isExist) return Promise.reject(adminConstant.MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
      else {
        params['userType'] = USER_TYPE.ADMIN;
        params['status'] = STATUS.UN_BLOCKED;
        let tmpUserData = await adminDao.signUp(params);
        //mailManager.tempSignUp({ email: params.email, password ,name:params.firstName});
        return adminConstant.MESSAGES.SUCCESS.SIGNUP({"userId": tmpUserData});
      }
    } catch (error) {
      // MongoDB transactions
      logger.error(error);
      throw error;
    }
  }

  async login(params: UserRequest.Login) {
    try {
      const step1 = await adminDao.isEmailExists(params);
      if (!step1) return Promise.reject(adminConstant.MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
      if (step1.status === STATUS.BLOCKED)
        return Promise.reject(adminConstant.MESSAGES.ERROR.BLOCKED);
      const isPasswordMatched = await matchPassword(
        params.password,
        step1.hash,
        step1.salt
      );
      if (!isPasswordMatched)
        return Promise.reject(adminConstant.MESSAGES.ERROR.INCORRECT_PASSWORD);
      else {
        const salt = crypto.randomBytes(64).toString("hex");
        const tokenData = {
          userId: step1._id,
          deviceId: params.deviceId,
          accessTokenKey: salt,
          type: TOKEN_TYPE.ADMIN_LOGIN,
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
            status: step1.status || "UN_BLOCKED"
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

        return adminConstant.MESSAGES.SUCCESS.LOGIN({
          accessToken,
          userId: step1._id,
          email: step1.email,
          userType: step1.userType,
          firstName: step1?.firstName,
          lastName: step1?.lastName,
          profilePicture: step1?.profilePicture,
          mobileNo: step1?.mobileNo,
        });
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export const adminController = new AdminController();