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

console.log("📂 KYC Upload Path:", uploadPath);

// Create directory if it doesn't exist
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

        console.log(
            "📥 Saving KYC File To:",
            uploadPath
        );

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

        console.log(
            "📄 KYC File:",
            filename
        );

        cb(null, filename);
    },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    // Only PDF files
    if (
        file.mimetype ===
        "application/pdf"
    ) {
        cb(null, true);
        return;
    }

    cb(
        new Error(
            "Only PDF files are allowed for KYC documents"
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
        // 5 MB maximum per file
        fileSize:
            5 * 1024 * 1024,
    },

});

// =====================================================
// EXPORT
// =====================================================

module.exports = kycUpload;