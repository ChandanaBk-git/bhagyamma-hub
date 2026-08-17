const isDev = import.meta.env.DEV;
const API_URL = import.meta.env.VITE_API_URL;

const SERVER_URL = isDev
  ? "http://localhost:5000"
  : API_URL
    ? API_URL.replace("/api/v1", "")
    : "https://bhagyamma-hub.onrender.com";

export const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";

  if (/^https?:\/\//i.test(path)) return path;

  return `${SERVER_URL}${path}`;
};