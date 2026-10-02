const multer = require("multer");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only JPG, JPEG, PNG and WEBP image files are allowed."
    ),
    false
  );
};

const createImageUpload = (maxFiles = 1) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: maxFiles,
    },
  });

const productImageUpload = createImageUpload(5);
const categoryImageUpload = createImageUpload(1);
const bannerImageUpload = createImageUpload(5);
const profileImageUpload = createImageUpload(1);

module.exports = {
  productImageUpload,
  categoryImageUpload,
  bannerImageUpload,
  profileImageUpload,
};