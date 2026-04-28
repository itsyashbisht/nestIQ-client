import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REQUEST = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach Bearer token
REQUEST.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nestiq_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — flatten data, handle 401
REQUEST.interceptors.request.use((config) => {
  // In Next.js we read from localStorage only on client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Flatten response
/*
  API returns:
  { statusCode: 200, data: { ... }, message: "Success", success: true }

  Axios wraps it as:
  response.data = { statusCode, data, message, success }

  We want:
  response.data = { ... }  ← just the actual data
*/
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

    // AUTO LOGOUT on 401 for authenticated flows.
    // Skip redirect for anonymous /me probes so public pages don't bounce to /login.
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthEntryPoint
    ) {
      console.log("Unauthorized — clearing token");
      localStorage.removeItem("accessToken");

      if (hasClientToken && !isSessionProbe) {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      console.error("Forbidden access");
    }

    if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  },
);

export default REQUEST;
