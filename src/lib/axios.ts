import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REQUEST = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  timeout: 15000,
});

// ✅ Request interceptor — attach token from localStorage
REQUEST.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — unchanged
REQUEST.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;
    if (apiResponse?.data !== undefined) {
      response.data = apiResponse.data;
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);

    const requestUrl = String(error.config?.url || "");
    const isAuthEntryPoint =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register");
    const isSessionProbe = requestUrl.includes("/users/me");
    const hasClientToken =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("accessToken"));

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthEntryPoint
    ) {
      localStorage.removeItem("accessToken");
      if (hasClientToken && !isSessionProbe) {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) console.error("Forbidden access");
    if (error.response?.status === 500) console.error("Server error");

    return Promise.reject(error);
  },
);

export default REQUEST;
