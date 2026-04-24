import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Reject immediately if it's not a 401 or if we've already tried to refresh
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Attempt to refresh the token using a clean axios instance to avoid interceptor loops
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;

      // Store new token and retry original request
      localStorage.setItem("token", accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear everything and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export default api;
