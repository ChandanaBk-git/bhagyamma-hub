const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload folders
const uploadRoot = path.join(process.cwd(), "uploads");

const folders = {
  products: path.join(uploadRoot, "products"),
  categories: path.join(uploadRoot, "categories"),
  banners: path.join(uploadRoot, "banners"),
  profiles: path.join(uploadRoot, "profiles"),
};

// Make sure folders exist
Object.values(folders).forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Allowed image types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Storage creator
const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folders[folder]);
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();

      const uniqueName = `${folder}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

      cb(null, uniqueName);
    },
  });

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF image files are allowed."
      ),
      false
    );
  }
};

// Product upload
const productImageUpload = multer({
  storage: createStorage("products"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4,
  },
});

// Category upload
const categoryImageUpload = multer({
  storage: createStorage("categories"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// Banner upload
const bannerImageUpload = multer({
  storage: createStorage("banners"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

// Profile upload
const profileImageUpload = multer({
  storage: createStorage("profiles"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = {
  productImageUpload,
  categoryImageUpload,
  bannerImageUpload,
  profileImageUpload,
};