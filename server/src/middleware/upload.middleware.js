const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// KYC UPLOAD DIRECTORY
// =====================================================

const uploadPath = path.join(
    process.cwd(),
    "uploads",
    "kyc"
);

console.log(
    "📂 KYC Upload Path:",
    uploadPath
);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true,
    });
}

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const userId =
            req.user?.userId || "USER";

        const documentType =
            file.fieldname || "document";

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const filename =
            `${userId}-${documentType}-${Date.now()}${extension}`;

        cb(null, filename);
    },
});

// =====================================================
// ALLOWED FILE TYPES
// =====================================================

const allowedMimeTypes = new Set([
    // PDF
    "application/pdf",

    // JPEG
    "image/jpeg",

    // PNG
    "image/png",

    // WEBP
    "image/webp",

    // GIF
    "image/gif",

    // BMP
    "image/bmp",

    // TIFF
    "image/tiff",
]);

const allowedExtensions = new Set([
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
]);

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    const mimeType =
        file.mimetype.toLowerCase();

    const validMime =
        allowedMimeTypes.has(
            mimeType
        );

    const validExtension =
        allowedExtensions.has(
            extension
        );

    if (
        validMime &&
        validExtension
    ) {
        cb(null, true);
        return;
    }

    cb(
        new Error(
            "Invalid file type. Allowed formats: PDF, JPG, JPEG, PNG, WEBP, GIF, BMP, TIF and TIFF."
        ),
        false
    );
};

// =====================================================
// MULTER
// =====================================================

const kycUpload = multer({

    storage,

    fileFilter,

    limits: {
        // 5 MB per file
        fileSize:
            5 * 1024 * 1024,

        // Maximum 3 files in one request
        files: 3,
    },

});

// =====================================================
// EXPORT
// =====================================================

module.exports = kycUpload;