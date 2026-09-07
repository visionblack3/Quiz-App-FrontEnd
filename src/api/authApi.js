import axiosClient from './axiosClient';

// POST /api/users/register
export const registerUser = (payload) =>
  axiosClient.post('/users/register', payload).then((res) => res.data);

// POST /api/users/login
export const loginUser = ({ username, password }) =>
  axiosClient.post('/users/login', { username, password }).then((res) => res.data);

// POST /api/users/forgot-password
export const forgotPassword = (email) =>
  axiosClient.post('/users/forgot-password', { email }).then((res) => res.data);

// POST /api/users/reset-password
export const resetPassword = ({ email, otp, newPassword }) =>
  axiosClient
    .post('/users/reset-password', { email, otp, newPassword })
    .then((res) => res.data);
