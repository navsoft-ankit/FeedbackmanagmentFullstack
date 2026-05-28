import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5091/api",

  headers: {
    "X-Api-Key": "mvc-api-secret-key-2026",
  }
});

// AUTO JWT TOKEN
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;