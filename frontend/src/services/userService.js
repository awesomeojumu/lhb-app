// frontend/src/services/userService.js

import api from './api'; // your axios instance

export const updateUserProfile = async (data) => {
  const res = await api.put('/users/me', data); // Matches backend route
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/users/me'); // Also uses axios instance with token
  return res.data;
};
