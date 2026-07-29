const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");

export const getImageUrl = (path) => {
  if (!path) return "";

  return `${SERVER_URL}${path}`;
};