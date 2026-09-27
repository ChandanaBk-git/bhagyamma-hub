const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   ALL PRODUCT-SECTION IMAGES
   ===================================================== */

const uploadPath = path.join(
  process.cwd(),
  "uploads",
  "products"
);

/* Create directory if it doesn't exist */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

/* =====================================================
   STORAGE
===================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename = `category-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

/* =====================================================
   ALLOWED IMAGE TYPES
===================================================== */

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

/* =====================================================
   FILE FILTER
===================================================== */

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = String(
    file.mimetype || ""
  ).toLowerCase();

  if (
    allowedMimeTypes.has(mimeType) &&
    allowedExtensions.has(extension)
  ) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Invalid image. Allowed formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIF and TIFF."
    ),
    false
  );
};

/* =====================================================
   MULTER
===================================================== */

const categoryUpload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = categoryUpload;