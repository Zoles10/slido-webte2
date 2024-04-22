import axios from "axios";

const API = axios.create({
  baseURL: "https://your-api-url.com", // Replace with your API base URL
});

// Intercept request to include JWT in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default API;
