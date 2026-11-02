import axios from "axios";
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api"
).replace(/\/$/, "");
export const authClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/api$/, ""),
  headers: { Accept: "application/json" },
  withCredentials: true,
  withXSRFToken: true,
});
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
  withCredentials: true,
  withXSRFToken: true,
});
// Sanctum uses an HttpOnly session cookie for this first-party SPA. No token is stored in source or browser storage.
export const apiError = (error) =>
  error.response?.data?.message || error.message || "The request failed.";
export default apiClient;
