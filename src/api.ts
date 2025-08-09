// api.ts
import axios from "axios";

const API_BASE = "https://192.168.1.28/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  // withCredentials: true, // bật nếu bạn dùng cookie/session
});

// Luôn gắn Authorization từ localStorage cho MỌI request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// (không bắt buộc) Tự xử lý 401 -> logout hoặc chuyển về /login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // ví dụ: xoá token và reload về login
      localStorage.removeItem("jwt");
      // window.location.href = "/login"; // tuỳ luồng của bạn
    }
    return Promise.reject(err);
  }
);

// Nếu vẫn muốn set/clear thủ công:
export function setAuth(token: string | null) {
  if (token) localStorage.setItem("jwt", token);
  else localStorage.removeItem("jwt");
}
