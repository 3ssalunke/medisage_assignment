import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    let _path = path.join(__dirname, "../../public/images/");
    cb(null, _path);
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

export const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
