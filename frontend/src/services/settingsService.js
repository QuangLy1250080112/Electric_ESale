import api from "./api";

// Get shop settings (public)
export const getShopSettings = async () => {
  const response = await api.get("/v1/settings/shop");
  return response.data;
};

// Update shop settings (admin only)
export const updateShopSettings = async (data) => {
  const response = await api.put("/v1/settings/shop", data);
  return response.data;
};
