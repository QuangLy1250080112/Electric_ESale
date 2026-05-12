import api from "./api";

// Get user's orders
export const getOrders = async () => {
  const response = await api.get("/v1/orders");
  return response.data;
};

// Get order details
export const getOrder = async (id) => {
  const response = await api.get(`/v1/orders/${id}`);
  return response.data;
};

// Checkout - create orders and deduct stock
export const checkout = async (items) => {
  const response = await api.post("/v1/orders/checkout", { items });
  return response.data;
};

// Get all orders (admin)
export const getAllOrders = async (page = 1, perPage = 10) => {
  const response = await api.get("/v1/orders/all", {
    params: { page, per_page: perPage },
  });
  return response.data;
};

// Cancel order
export const cancelOrder = async (id) => {
  const response = await api.delete(`/v1/orders/${id}`);
  return response.data;
};

// ===== REVIEWS =====

// Check if current user can review a product
export const checkCanReview = async (productId) => {
  const response = await api.get(`/v1/orders/reviews/can-review/${productId}`);
  return response.data;
};

// Get reviews for a product
export const getProductReviews = async (productId) => {
  const response = await api.get(`/v1/orders/reviews/${productId}`);
  return response.data;
};

// Create review with image uploads
export const createReview = async (productId, rating, comment, imageFiles = []) => {
  const formData = new FormData();
  formData.append("ID_sanpham", productId);
  formData.append("rating", rating);
  if (comment) formData.append("comment", comment);
  for (const file of imageFiles) {
    formData.append("images", file);
  }
  const response = await api.post("/v1/orders/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/v1/orders/reviews/${reviewId}`);
  return response.data;
};
