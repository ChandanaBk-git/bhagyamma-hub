const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../src/models/product");

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "products"
);

async function findMissingImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const products = await Product.find({})
      .select("_id name images")
      .lean();

    const missing = [];

    for (const product of products) {
      if (!Array.isArray(product.images)) {
        continue;
      }

      for (const image of product.images) {
        if (!image) {
          continue;
        }

        const filename = path.basename(image);
        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
          missing.push({
            productId: product._id.toString(),
            productName: product.name,
            imagePath: image,
            filename,
          });
        }
      }
    }

    console.log("\n=================================");
    console.log("MISSING PRODUCT IMAGES");
    console.log("=================================\n");

    console.log("Products checked:", products.length);
    console.log("Missing image references:", missing.length);

    if (missing.length === 0) {
      console.log("\nNo missing images found.");
    } else {
      console.log("\nMissing images:\n");

      missing.forEach((item, index) => {
        console.log(`${index + 1}. Product: ${item.productName}`);
        console.log(`   Product ID: ${item.productId}`);
        console.log(`   MongoDB path: ${item.imagePath}`);
        console.log(`   Missing file: ${item.filename}`);
        console.log("");
      });
    }

    await mongoose.disconnect();

    console.log("Done. NO DATABASE OR FILES WERE CHANGED.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

findMissingImages();