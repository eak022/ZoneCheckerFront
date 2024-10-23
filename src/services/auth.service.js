import api from "./api";

const API_URL = import.meta.env.VITE_AUTH_API;

const register = async (username, email, password) => {
  return await api.post(`${API_URL}/signup`, { username, email, password });
};

const login = async (username, password) => {
  const response = await api.post(`${API_URL}/signin`, { username, password });
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  // Optionally handle server-side token invalidation here
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;