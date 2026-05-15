import api from './api';

export const getNews = async (skip = 0, limit = 100) => {
  const response = await api.get(`/v1/news/?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getNewsById = async (id) => {
  const response = await api.get(`/v1/news/${id}`);
  return response.data;
};

export const createNews = async (formData) => {
  const response = await api.post('/v1/news/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateNews = async (id, formData) => {
  const response = await api.put(`/v1/news/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await api.delete(`/v1/news/${id}`);
  return response.data;
};

export const createComment = async (id, data) => {
  const response = await api.post(`/v1/news/${id}/comments`, data);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/v1/news/comments/${commentId}`);
  return response.data;
};
