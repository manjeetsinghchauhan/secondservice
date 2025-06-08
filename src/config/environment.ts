import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const ENVIRONMENT = process.env.NODE_ENV || "localhost";

switch (ENVIRONMENT) {
	case "dev":
	case "development": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.development"))) {
			dotenv.config({ path: ".env.development" });
		} else {
			console.log("Unable to find Environment File");
			process.exit(1);
		}
		break;
	}
	case "qa": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.qa"))) {
			dotenv.config({ path: ".env.qa" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "stag":
	case "staging": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.staging"))) {
			dotenv.config({ path: ".env.staging" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "preprod": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.preprod"))) {
			dotenv.config({ path: ".env.preprod" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "prod":
	case "production": {
		if (fs.existsSync(path.join(process.cwd(), "/.env"))) {
			dotenv.config({ path: ".env" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "default": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.default"))) {
			dotenv.config({ path: ".env.default" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "local": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.local"))) {
			dotenv.config({ path: ".env.local" });
		} else {
			process.exit(1);
		}
		break;
	}
	default: {
		fs.existsSync(path.join(process.cwd(), "/.env.local")) ? dotenv.config({ path: ".env.local" }) : process.exit(1);
	}
}

export const SERVER = Object.freeze({
	APP_NAME: "HomeService",
	APP_LOGO: "https://appinventiv-development.s3.amazonaws.com/1607946234266_Sqlv5.svg",
	TEMPLATE_PATH: process.cwd() + "/src/views/",
	UPLOAD_DIR: process.cwd() + "/src/uploads/",
	LOG_DIR: process.cwd() + "/logs",
	TOKEN_INFO: {
		EXPIRATION_TIME: {
			USER_LOGIN: 180 * 24 * 60 * 60 * 1000, // 180 days
			ADMIN_LOGIN: 180 * 24 * 60 * 60 * 1000, // 180 days
			BLOCKED_ACCOUNT: 8 * 60 * 60 * 1000, // 8 hours
			FORGOT_PASSWORD: 10 * 60 * 1000, // 10 mins
			VERIFY_EMAIL: 5 * 60 * 1000, // 5 mins
			VERIFY_MOBILE: 2 * 60 * 1000, // 2 mins
			ADMIN_OTP_VERIFY: 10 * 60 * 1000, // 10 mins
		},
		ISSUER: process.env["APP_URL"]
	},
	JWT_PRIVATE_KEY: process.cwd() + "/keys/jwtRS256.key",
	JWT_PUBLIC_KEY: process.cwd() + "/keys/jwtRS256.key.pub",
	// for private.key file use RS256, SHA256, RSA
	JWT_ALGO: "RS256",
	SALT_ROUNDS: 10,
	ENC: "102938$#@$^@1ERF",
	CHUNK_SIZE: 1000,
	APP_URL: process.env["APP_URL"],
	ADMIN_URL: process.env["ADMIN_URL"],
	MICROSERVICE_URL: process.env["MICROSERVICE_URL"],
	API_BASE_URL: "/"+process.env["MICROSERVICE_URL"]+"/api/"+process.env["VERSION"],
	MONGO: {
		DB_NAME: process.env["DB_NAME"],
		DB_URL: process.env["DB_URL"],
		OPTIONS: {
			user: process.env["DB_USER"],
			pass: process.env["DB_PASSWORD"],
			// useNewUrlParser: true,
			// useCreateIndex: true,
			// useUnifiedTopology: true,
			// useFindAndModify: false
		},
		REPLICA: process.env["DB_REPLICA"],
		REPLICA_OPTION: {
			replicaSet: process.env["DB_REPLICA_SET"],
			authSource: process.env["DB_AUTH_SOURCE"],
			ssl: process.env["DB_SSL"]
		}
	},
	TARGET_MONGO: {
		DB_NAME: process.env["TARGET_DB_NAME"],
		DB_URL: process.env["TARGET_DB_URL"],
		OPTIONS: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	},
	ADMIN_CREDENTIALS: {
		EMAIL: process.env["ADMIN_EMAIL"],
		PASSWORD: process.env["ADMIN_PASSWORD"],
		NAME: process.env["ADMIN_NAME"]
	},
	REDIS: {
		HOST: process.env["REDIS_HOST"],
		PORT: process.env["REDIS_PORT"],
		DB: process.env["REDIS_DB"],
		NAMESPACE: "Rccapp",
		APP_NAME: "Rcc"
	},

	MAIL: {
		SMTP: {
			HOST: process.env["SMTP_HOST"],
			PORT: process.env["SMTP_PORT"],
			USER: process.env["SMTP_USER"],
			PASSWORD: process.env["SMTP_PASSWORD"]
		}
	},

	MESSAGEBIRD: {
		ACCESS_KEY: process.env["MESSAGEBIRD_ACCESS_KEY"]
	},
	BASIC_AUTH: {
		NAME: "rcc",
		PASS: "rcc@123"
	},
	API_KEY: "1234",
	AWS_IAM_USER: {
		ACCESS_KEY_ID: process.env["AWS_ACCESS_KEY"],
		SECRET_ACCESS_KEY: process.env["AWS_SECRET_KEY"]
	},
	S3: {
		BUCKET_NAME: process.env["S3_BUCKET_NAME"],
		REGION: process.env["S3_REGION"],
		BUCKET_URL: process.env["BUCKET_URL"]
	},
	ENVIRONMENT: process.env["ENVIRONMENT"],
	IP: process.env["IP"],
	PORT: process.env["PORT"],
	PROTOCOL: process.env["PROTOCOL"],
	FCM_SERVER_KEY: process.env["FCM_SERVER_KEY"],
	DISPLAY_COLORS: true,
	MAIL_TYPE: 2,
	IS_REDIS_ENABLE: true,
	IS_SINGLE_DEVICE_LOGIN: {
		PARTICIPANT: true,
		SUPPORTER: true
	},
	IS_MAINTENANCE_ENABLE: process.env["IS_MAINTENANCE_ENABLE"],
	FLOCK_URL: process.env["FLOCK_URL"],
	ACTIVITY_TIME: {
		GROUP: 10 * 60 * 1000, // 4 hours
		SHIFT: 10 * 60 * 1000  // 2 hours
	},
	IS_RABBITMQ_DELAYED_ENABLE: false,

	RABBITMQ: {
		URL: process.env["RABBITMQ_URL"],
		QUEUE_NAME: process.env["RABBITMQ_QUEUE_NAME"]
	},
	DEFAULT_PASSWORD: "String@123",
	DEFAULT_OTP: "1234"
});