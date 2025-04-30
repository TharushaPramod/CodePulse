// frontend/src/services/progressUpdateService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/progress-updates';

export const createProgressUpdate = async (progressUpdate) => {
  const response = await axios.post(API_URL, progressUpdate);
  return response.data;
};

export const getProgressUpdatesByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const getProgressUpdateById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateProgressUpdate = async (id, progressUpdate) => {
  const response = await axios.put(`${API_URL}/${id}`, progressUpdate);
  return response.data;
};

export const deleteProgressUpdate = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};