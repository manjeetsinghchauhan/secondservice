import { MESSAGES } from "@config/main.constant";
import { appointmentDaoV1 } from "..";
import { APPOINTMENT_MESSAGE } from "./appointmentConstant";


class AppointmentController {
    async add(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            await appointmentDaoV1.add(params);
            return APPOINTMENT_MESSAGE.SUCCESS.ADD_CONTENT;
        } catch (error) {
            console.error("AppointmentController :: add", error);
            throw error;

        }
    }

    async listing(params,tokenData) {
        try {
            params["userId"]=tokenData.userId;
            const data = await appointmentDaoV1.listing(params);
            return MESSAGES.SUCCESS.DETAILS(data);
        } catch (error) {
            console.error("AppointmentController :: listing", error);
            throw error;

        }
    }

    async edit(params,tokenData) {
        try {
            await appointmentDaoV1.edit(params);
            return APPOINTMENT_MESSAGE.SUCCESS.EDIT_CONTENT;
        } catch (error) {
            console.error("AppointmentController :: edit", error);
            throw error;

        }
    }

    async delete(params,tokenData) {
        try {
            await appointmentDaoV1.delete(params);
            return APPOINTMENT_MESSAGE.SUCCESS.DELETE_CONTENT;
        } catch (error) {
            console.error("AppointmentController :: delete", error);
            throw error;

        }
    }

}
export const appointmentController = new AppointmentController();