import { timeConversion } from "@utils/appUtils";
import { TEMPLATES, SERVER } from "@config/index";
import { TemplateUtil } from "@utils/TemplateUtil";
const sgMail = require("@sendgrid/mail");

export class MailManager {

	async sendMail(params) {
		try {
			sgMail.setApiKey(process.env["SENDGRID_API_KEY"]);
			let msg = {
				to: params.email,
				from: `${SERVER.APP_NAME} <${process.env["FROM_MAIL"]}>`, // sender email
				subject: params.subject,
				html: params.content,
			};
			if (params.bcc) msg["bcc"] = params["bcc"];
			if (params.attachments) {
				msg["attachments"] = [{
					filename: params.fileName,
					path: params.filePath,
					// content: params.file,
					// encoding: 'base64',
				}];
			}
			return new Promise((resolve) => {
				sgMail.send(msg, function (error, info) {
					if (error) {
						console.log("error=================", JSON.stringify(error.response.body));
						resolve(false);
					} else {
						resolve(true);
					}
				});
			});
		} catch (error) {
			console.log("Hello there")
		}
		return {};
	}

	async forgotPasswordMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "forgot-password.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.FORGOT_PASSWORD)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}
	async composeMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "compose.html"))
			.compileFile({
				"message": params.message,
				"name": params.name,
			});

		return await this.sendMail({
			"email": params.email,
			"subject": params.subject,
			"content": mailContent
		});
	}
	async incidenReportdMail(params) {//NOSONAR
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "forgot-password.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.FORGOT_PASSWORD)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}

	/**
	 * @function accountBlocked
	 * @description user account have been blocked
	 */
	async accountBlocked(payload) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "account-blocked.html"))
			.compileFile({
				"name": payload?.name,
				"reason": payload.reason
			});

		return await this.sendMail({
			"email": payload.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.ACCOUNT_BLOCKED,
			"content": mailContent
		});
	}

	/**
	 * @function welcomeEmail
	 * @description send welcome email to user after profile completion
	 * @author Rajat Maheshwari
	 * @param params.email: user's email
	 * @param params.name: user's name
	 */
	async welcomeEmail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "welcome-email.html"))
			.compileFile({
				"name": params.name
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.WELCOME,
			"content": mailContent
		});
	}

	/**
	 * @function accountBlocked
	 * @description user account have been rejected
	 */
	async verificationStatus(payload) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "verification-process.html"))
			.compileFile({
				"name": payload?.name,
				"reason": payload.reason
			});

		return await this.sendMail({
			"email": payload.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.VERIFICATION_REJECTED,
			"content": mailContent
		});
	}
	async tempSignUp(params) {
		console.log("pram",params);
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "temp-signup.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.VERIFY_EMAIL,
			"content": mailContent
		});
	}
}

export const mailManager = new MailManager();