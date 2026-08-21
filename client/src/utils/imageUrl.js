const API_URL = import.meta.env.VITE_API_URL || "";

const SERVER_URL = API_URL
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

const FALLBACK_IMAGE = "/images/no-image.png";

export const getImageUrl = (path) => {
  if (!path) {
    return FALLBACK_IMAGE;
  }

  let imagePath = String(path).trim();

  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  // -----------------------------------------
  // Already a complete URL
  // -----------------------------------------
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // -----------------------------------------
  // Normalize Windows paths
  // Example:
  // uploads\products\image.png
  // -----------------------------------------
  imagePath = imagePath.replace(/\\/g, "/");

  // -----------------------------------------
  // Remove localhost URLs accidentally stored
  // -----------------------------------------
  imagePath = imagePath.replace(
    /^https?:\/\/localhost:\d+/i,
    ""
  );

  // -----------------------------------------
  // Remove API prefix if stored
  // -----------------------------------------
  imagePath = imagePath.replace(
    /^\/?api\/v1\/?/i,
    ""
  );

  // -----------------------------------------
  // Remove leading slash
  // -----------------------------------------
  imagePath = imagePath.replace(/^\/+/, "");

  // -----------------------------------------
  // Handle paths such as:
  //
  // uploads/products/image.jpg
  // /uploads/products/image.jpg
  // products/image.jpg
  // image.jpg
  // -----------------------------------------

  return `${SERVER_URL}/${imagePath}`;
};

export default getImageUrl;