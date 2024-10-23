import axios from "axios";
import tokenservice from "./token.service";

const baseURL = import.meta.env.VITE_BASE_URL;
console.log(baseURL);

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = tokenservice.getLocalAccessToken();
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;