// frontend/src/services/userService.js

import api from './api'; // your axios instance

export const updateUserProfile = async (data) => {
  const res = await api.put('/users/me', data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export function calculateProfileCompletion(user) {
  const requiredFields = [
    "firstName", "lastName", "email", "phone", "sex", "ageBracket", "dateOfBirth",
    "battalion", "lhbLevel", "lhbCode", "relationshipStatus", "address", "country",
    "personalityType", "fiveFoldGift", "leadershipRoles", "education", "jobStatus",
    "purposeStatus", "primaryMountain"
  ];

  const filled = requiredFields.filter(field => {
    const value = user[field];
    return value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0);
  });

  const percentage = Math.round((filled.length / requiredFields.length) * 100);
  return percentage;
}
