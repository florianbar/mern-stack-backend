const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: 500000, // 500kb
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/images"); // The folder where the images will be stored
    },
    filename: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      const fileName = `${uuidv4()}.${ext}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("Invalid mime type!");
    callback(error, isValid);
  },
});

module.exports = fileUpload;
