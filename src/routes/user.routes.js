import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// add file upload middleware to POST /resgister route for avatar and cover image
router.post("/register",
    upload.fields([
        {
            name: "avatar", // avatar field ( also provide the same name on frontend )
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

export default router;
