const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   PRODUCT UPLOAD DIRECTORY
===================================================== */

const uploadPath = path.join(
  process.cwd(),
  "uploads",
  "products"
);

console.log(
  "📂 Product Upload Path:",
  uploadPath
);


/* =====================================================
   CREATE DIRECTORY IF NOT EXISTS
===================================================== */

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

    cb(
      null,
      uploadPath
    );

  },


  filename: (req, file, cb) => {

    /*
     * Generate a unique filename.
     *
     * Example:
     *
     * 1786890000000-123456789.jpeg
     */

    const extension =
      path
        .extname(
          file.originalname
        )
        .toLowerCase();


    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;


    cb(
      null,
      filename
    );

  },

});


/* =====================================================
   ALLOWED IMAGE TYPES
===================================================== */

const allowedMimeTypes =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ]);


const allowedExtensions =
  new Set([
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

const fileFilter = (
  req,
  file,
  cb
) => {

  const extension =
    path
      .extname(
        file.originalname
      )
      .toLowerCase();


  const mimeType =
    String(
      file.mimetype || ""
    ).toLowerCase();


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

    cb(
      null,
      true
    );

    return;
  }


  cb(
    new Error(
      "Invalid product image. Allowed formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIF and TIFF."
    ),
    false
  );

};


/* =====================================================
   MULTER
===================================================== */

const productUpload =
  multer({

    storage,

    fileFilter,

    limits: {

      /*
       * Maximum 5 MB per image
       */

      fileSize:
        5 * 1024 * 1024,

      /*
       * Maximum 5 images
       */

      files: 5,

    },

  });


/* =====================================================
   EXPORT
===================================================== */

module.exports =
  productUpload;