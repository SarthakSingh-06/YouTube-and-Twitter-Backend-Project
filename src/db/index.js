import mongoose from "mongoose";
import "dotenv/config";

async function connectDB() {
    try{
        const DB_URI = process.env.MONGODB_URI;
        const connectionResponse = await mongoose.connect(DB_URI);
        console.log(`Database connected!`);
        console.log(`Connection port: ${connectionResponse.connection.port}`);
        console.log(`Connection host: ${connectionResponse.connection.host}`);
    } catch(error) {
        console.error("Database connection FAILED!");
        console.error("ERROR:", error.message);
        process.exit(1);
    };
};

export default connectDB;
