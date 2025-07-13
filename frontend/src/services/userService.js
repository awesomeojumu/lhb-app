import api from './api'; // your axios instance

export const updateUserProfile = async (data) => {
  const res = await api.put('/users/profile', data); // Axios uses application/json by default
  return res.data;
};
