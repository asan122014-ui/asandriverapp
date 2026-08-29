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

axiosInstance.interceptors.response.use(
  (
    response
  ) =>
    response,

  (
    error
  ) => {
    if (
      error?.response
        ?.status ===
      401
    ) {
      console.error(
        "Driver authentication failed:",
        error?.response
          ?.data
      );

      /*
        Backend currently does not have
        /api/auth/refresh.

        So do NOT attempt refresh here.
      */

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "driver"
      );

      if (
        window.location.pathname !==
        "/DriverLogin"
      ) {
        window.location.href =
          "/DriverLogin";
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default axiosInstance;