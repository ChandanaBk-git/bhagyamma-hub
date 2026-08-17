import API from "../api";

export const getWallet = async () => {
  const response = await API.get("/wallet");
  return response.data?.data || { wallet: {}, transactions: [] };
};