import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // remove trailing and leading white-spaces
        lowercase: true,
        index: true // make a field indexed if you have to search for it very often ( optimises the search but costy )
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary URL
        required: true
    },
    coverImage: {
        type: String, // cloudinary URL
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must contain at least 8 characters"],
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// execute the middleware callback function just before the save event happens ( or just before anything changes in user schema )
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next(); // do nothing if password is not modified
    this.password = await bcrypt.hash(this.password, 12); // hash the password
    next();
});

// add methods to user schema for checking password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname,
        uaername: this.username
    }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

export const User = model("User", userSchema);
