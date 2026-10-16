
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const Product = require("../src/models/product");

const createProductSlug = (productName) => {
  return String(productName || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const run = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string not found. Check your server/.env variable name."
    );
  }

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB.");
  console.log("Checking existing products...");

  const products = await Product.find({})
    .select("_id productName slug")
    .sort({ _id: 1 })
    .lean();

  // Preserve all existing non-empty slugs.
  const usedSlugs = new Set(
    products
      .map((product) => String(product.slug || "").trim().toLowerCase())
      .filter(Boolean)
  );

  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    if (String(product.slug || "").trim()) {
      continue;
    }

    const baseSlug = createProductSlug(product.productName);

    if (!baseSlug) {
      console.log(
        `Skipped product ${product._id}: no valid slug could be generated.`
      );
      skippedCount++;
      continue;
    }

    let slug = baseSlug;
    let counter = 2;

    // Give duplicate product names unique URLs.
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const result = await Product.updateOne(
      {
        _id: product._id,
        $or: [
          { slug: { $exists: false } },
          { slug: "" },
          { slug: null },
        ],
      },
      {
        $set: { slug },
      }
    );

    if (result.modifiedCount === 1) {
      usedSlugs.add(slug);
      updatedCount++;

      console.log(
        `Updated: ${product.productName} -> ${slug}`
      );
    } else {
      console.log(
        `Skipped ${product._id}: product changed before update.`
      );
      skippedCount++;
    }
  }

  console.log("\nSlug backfill completed.");
  console.log(`Products updated: ${updatedCount}`);
  console.log(`Products skipped: ${skippedCount}`);
  console.log(`Products checked: ${products.length}`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Slug backfill failed:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  process.exitCode = 1;
});
