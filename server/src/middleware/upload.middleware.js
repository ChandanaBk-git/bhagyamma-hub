const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
]);

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = String(
    file.mimetype || ""
  ).toLowerCase();

  const validMime = allowedMimeTypes.has(mimeType);
  const validExtension = allowedExtensions.has(extension);

  if (validMime && validExtension) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Invalid product image. Allowed formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIF and TIFF."
    ),
    false
  );
};

const productUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

module.exports = productUpload;