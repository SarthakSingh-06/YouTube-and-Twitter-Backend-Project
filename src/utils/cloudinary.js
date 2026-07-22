import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs"; // for unlinking files from local server on uploaded on cloudinary
import "dotenv/config";
import { ApiError } from "./apiError.js";

// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // identify resource type automatically
        });

        fs.unlinkSync(localFilePath); // remove the file from local server after upload is successful
        return response;
    } catch (error) {
        // If upload fails
        return null;
    }
};

export { uploadFileOnCloudinary };
