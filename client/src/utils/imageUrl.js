
const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : import.meta.env.VITE_API_URL ||
    "https://bhagyamma-hub.onrender.com/api/v1";

const SERVER_URL = API_URL
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/+$/, "");

const FALLBACK_IMAGE = "/images/no-image.png";

export const getImageUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;

  let imagePath = String(path).trim();

  if (!imagePath) return FALLBACK_IMAGE;

  // Normalize Windows-style paths.
  imagePath = imagePath.replace(/\\/g, "/");

  // Keep existing external image URLs, including Cloudinary.
  if (/^https?:\/\//i.test(imagePath)) {
    // Convert old localhost image URLs to the configured backend.
    if (/^https?:\/\/(localhost|127\.0\.0\.1):\d+/i.test(imagePath)) {
      imagePath = imagePath.replace(
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+/i,
        ""
      );
    } else {
      return imagePath;
    }
  }

  // Remove an accidentally stored API prefix.
  imagePath = imagePath.replace(/^\/?api\/v1\/?/i, "");

  // Ensure a single leading slash.
  imagePath = `/${imagePath.replace(/^\/+/, "")}`;

  return `${SERVER_URL}${imagePath}`;
};

export default getImageUrl;
