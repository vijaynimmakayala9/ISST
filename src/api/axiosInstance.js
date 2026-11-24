import axios from "axios";
import { clearSession, readSession } from "../auth/sessionManager";
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://31.97.228.17:4479",
  timeout: 30000,
});
client.interceptors.request.use((config) => {
  const session = readSession();
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/api/admin/login")
    ) {
      clearSession();
      window.dispatchEvent(new Event("isst-session-expired"));
    }
    return Promise.reject(error);
  },
);
export const errorText = (e) =>
  e.response?.data?.error ||
  e.response?.data?.message ||
  e.message ||
  "Request failed";
export default client;
