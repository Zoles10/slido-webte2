import { apiUrl } from "@/utils/config";
import axios from "axios";

const API = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
});

// Intercept request to include JWT in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default API;
