import axios from 'axios';

// Set VITE_API_BASE_URL in a .env file to point at your Spring Boot backend.
// Defaults to localhost:8080, the standard Spring Boot dev port.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('quizapp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize error message extraction (GlobalExceptionHandler always returns { message }).
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/expired/invalid — clear local session.
      localStorage.removeItem('quizapp_token');
      localStorage.removeItem('quizapp_user');
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
