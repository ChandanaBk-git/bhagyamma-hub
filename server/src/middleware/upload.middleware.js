const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =========================
// Upload Folder
// =========================

const uploadPath = path.join(process.cwd(), "uploads", "products");

console.log("📂 Upload Path:", uploadPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// =========================
// Storage
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📥 Saving File To:", uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    console.log("📸 Incoming File:", file.originalname);

    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    console.log("✅ Saved As:", filename);

    cb(null, filename);
  },
});

// =========================
// File Filter
// =========================

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// =========================
// Export
// =========================

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});