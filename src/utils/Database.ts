import mongoose from "mongoose";
import { SERVER } from "@config/environment";
import fs from  "fs";
import csv from "csv-parser";
import path from "path";
const Pincode = require('../modules/admin/pincode/pincodeModel').pincodes; 


// Connect to MongoDB
export class Database {
	async connectToDb() {
		return new Promise((resolve, reject) => {
			try {
				const dbName = SERVER.MONGO.DB_NAME;
				let dbUrl = SERVER.MONGO.DB_URL;
				let dbOptions: any = SERVER.MONGO.OPTIONS;
				if (SERVER.ENVIRONMENT === "production") {
					dbUrl = dbUrl + dbName;
				} else {
					dbUrl = dbUrl + dbName;
					mongoose.set("debug", true);
				}
				mongoose.connect(dbUrl, dbOptions);
				mongoose.connection.on("connected", function () {
					console.info(SERVER.DISPLAY_COLORS ? "\x1b[32m%s\x1b[0m" : "%s", `Connected to ${dbUrl}`);
					resolve({});
				});
				// If the connection throws an error
				mongoose.connection.on("error", error => {
					reject(error);
				});

				// When the connection is disconnected
				mongoose.connection.on("disconnected", () => {
					reject("DB connection disconnected.");//NOSONAR
				});
			} catch (error) {
				reject(error);
			}
		});
	}


	async insertDefaultData() {
		try {
			await this.importPincodes();
		} 
		catch (error) {
			console.error("Error inserting pincode:", error);
		}
	}

	/**
	 * 
	 * @returns  {Promise<void>}
  	 * @description Imports pincodes from a CSV file into the database.
  	 * If the database already contains pincodes, it skips the import.
  	 * The CSV file should be located at `src/modules/admin/pincode/data/pincodes.csv`.
	 */
	async importPincodes() {
		const existing = await Pincode.estimatedDocumentCount();
		// If pincodes already exist, skip the import
		if (existing > 0) {
			console.log('Pincodes already exist. Skipping import.');
			return;
		}

		const results = [];
		const path = require('path');
		const filePath = path.join(__dirname, '../../../src/modules/admin/pincode/data/pincodes.csv'); // go up as needed
		if (!fs.existsSync(filePath)) {
			console.error('Pincode CSV file not found at:', filePath);
			return;
		}
		fs.createReadStream(filePath)
			.pipe(csv({
  				mapHeaders: ({ header }) => header.trim()	
	   	 	}))	
			.on('data', (data) => {
				// Clean officeType
				if (data.officeType) {
					data.officeType = data.officeType.replace(/\./g, '').toUpperCase(); // "B.O" → "BO"
				}
				results.push(data);
			})
			.on('end', async () => {
			try {
				await Pincode.insertMany(results);
				console.log('Pincode data imported successfully');
			} catch (err) {
				console.error('Error inserting pincode data:', err.message);
			}
			});
	}
}