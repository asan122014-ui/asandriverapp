import { attachSession } from '../session/session';
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://asan-driverapp.onrender.com/api",

  timeout:
    30000,

  headers: {
    Accept:
      "application/json",
  },
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

axiosInstance.interceptors.request.use(
  (
    config
  ) => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (
      token
    ) {
      config.headers =
        config.headers ||
        {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (
    error
  ) =>
    Promise.reject(
      error
    )
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

attachSession(axiosInstance);

// Share identical in-flight reads; do not cache completed responses or writes.
const pendingReads = new Map();
const originalGet = axiosInstance.get.bind(axiosInstance);
axiosInstance.get = (url, config = {}) => {
  if (config.signal || config.cancelToken) return originalGet(url, config);
  const key = JSON.stringify([url, config, localStorage.getItem("accessToken")]);
  if (pendingReads.has(key)) return pendingReads.get(key);
  const request = originalGet(url, config).then(
    (response) => { pendingReads.delete(key); return response; },
    (error) => { pendingReads.delete(key); throw error; }
  );
  pendingReads.set(key, request);
  return request;
};

export default axiosInstance;