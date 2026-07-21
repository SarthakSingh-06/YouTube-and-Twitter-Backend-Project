import multer from "multer";

// using multer's disk storage engine to get full control on storing files to disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // file represents the uploaded file
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage });

export { upload };
