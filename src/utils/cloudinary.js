import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs"; // for unlinking files from local server on uploaded on cloudinary
import "dotenv/config";
import e from "cors";
import { ApiError } from "./apiError";

// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath){
            throw new ApiError(400, "file path not found");
        }

        // upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // identify resource type automatically
        });
        console.log("UPLOAD RESPONSE:", response);
        console.log("Public URL:", response.url);
        return response;
    } catch (error) {
        // If upload fails
        fs.unlinkSync(localFilePath); // unlink corrupted and maliscious files from local server
        return null;
    }
};

export { uploadFileOnCloudinary };
