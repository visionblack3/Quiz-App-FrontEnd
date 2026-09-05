import axiosClient from './axiosClient';

// POST /api/users/register  (User body: username, email, password)
export const registerUser = (payload) =>
  axiosClient.post('/api/users/register', payload).then((res) => res.data);

// POST /api/users/login  (User body: username, password) -> LoginResponse
export const loginUser = ({ username, password }) =>
  axiosClient.post('/api/users/login', { username, password }).then((res) => res.data);

// POST /api/users/forgot-password  (ForgotPasswordRequest: email)
export const forgotPassword = (email) =>
  axiosClient.post('/api/users/forgot-password', { email }).then((res) => res.data);

// POST /api/users/reset-password  (ResetPasswordRequest: email, otp, newPassword)
export const resetPassword = ({ email, otp, newPassword }) =>
  axiosClient
    .post('/api/users/reset-password', { email, otp, newPassword })
    .then((res) => res.data);
