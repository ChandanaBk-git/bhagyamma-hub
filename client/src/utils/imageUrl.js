const API_URL =
  import.meta.env.VITE_API_URL || "";

const SERVER_URL = API_URL
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

const FALLBACK_IMAGE =
  "/images/no-image.png";

export const getImageUrl = (path) => {
  if (!path) {
    return FALLBACK_IMAGE;
  }

  let imagePath = String(path).trim();

  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  // -----------------------------------------
  // Normalize Windows paths
  // -----------------------------------------

  imagePath = imagePath.replace(
    /\\/g,
    "/"
  );

  // -----------------------------------------
  // FIX OLD LOCALHOST URLS
  //
  // Example:
  // http://localhost:5000/uploads/products/a.jpg
  //
  // becomes:
  // /uploads/products/a.jpg
  // -----------------------------------------

  imagePath = imagePath.replace(
    /^https?:\/\/localhost:\d+/i,
    ""
  );

  imagePath = imagePath.replace(
    /^https?:\/\/127\.0\.0\.1:\d+/i,
    ""
  );

  // -----------------------------------------
  // External production URL
  //
  // If it is NOT localhost, preserve it.
  // -----------------------------------------

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // -----------------------------------------
  // Remove API prefix if accidentally stored
  // -----------------------------------------

  imagePath = imagePath.replace(
    /^\/?api\/v1\/?/i,
    ""
  );

  // -----------------------------------------
  // Remove leading slash
  // -----------------------------------------

  imagePath = imagePath.replace(
    /^\/+/,
    ""
  );

  // -----------------------------------------
  // Build production URL
  // -----------------------------------------

  return `${SERVER_URL}/${imagePath}`;
};

export default getImageUrl;