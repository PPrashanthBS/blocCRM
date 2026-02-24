"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not set. Please add your MongoDB Atlas connection string in server/.env');
        }
        const conn = await mongoose_1.default.connect(mongoUri, {
            dbName: 'leads_db',
        });
        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map