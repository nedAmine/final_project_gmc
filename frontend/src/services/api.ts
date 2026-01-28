import axios from "axios";
import { store } from "../context/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // retrieves the value according to the environment
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;