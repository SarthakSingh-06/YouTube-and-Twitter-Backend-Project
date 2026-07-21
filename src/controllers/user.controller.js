import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // take username, fullname, email, passoword and other details from user ( via frontend )
    const { username, fullname, email, avatar } = req.body;

    // validate details
    if (
        [ username, fullname, email, avatar ].some((field) =>  field?.trim() === "" )
    ) {
        throw new ApiError(400, "all fields are required");
    }

    // check if user already exists: using email or username or both
    // if yes, send an error response
    const existingUser = await User.findOne({
        $or: [{ email }, { username }], // return user if either of email or username matches
    });

    if (existingUser){
        throw new ApiError(409, "user with email or username already exists");
    }

    // get path for local file upload
    const avatarLocalPath = req.files?.avatar[0]?.path; // mandatory field
    const coverImageLocalPath = req.files?.coverImage[0]?.path; // optional field

    // Check if avatar upload is successful
    if (!avatarLocalPath){
        throw new ApiError(400, "An avatar image for your profile is requiered");
    }

    // upload image files to cloudinary
    const avatarOnCloudinary = await uploadFileOnCloudinary(avatarLocalPath);
    const coverImageOnCloudinary = await uploadFileOnCloudinary(coverImageLocalPath);

    if (!avatarOnCloudinary){
        throw new ApiError(400, "An avatar image for your profile is requiered");
    }

    // Create user object - create an entry in DB ( make sure to hash password )
    const newUser = await User.create({
        username: username.toLowerCase(),
        email, fullname, password,
        avatar: avatarOnCloudinary.url,
        coverImage: coverImageOnCloudinary?.url || "",
    });

    // check if DB insertion is successful
    // then remove password and refresh token field from response
    const newUserCreated = await User.findById(newUser._id).select(
        "-password -refreshToken" // remove these fields
    );

    // Send an error response if DB insertion fails
    if (!newUserCreated){
        throw new ApiError(500, "Failed to register new user");
    };

    // send success response
    return res.status(201).json(
        new ApiResponse(201, newUserCreated, "registeration successful")
    );
});

export {
    registerUser
};
