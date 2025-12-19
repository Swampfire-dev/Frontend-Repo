import axios from "axios";
import API_URLS from "../config/apiUrls";
import logger from "../utils/logger";

const axiosInstance = axios.create({
  baseURL: API_URLS.BASE,
  withCredentials: true,
});

/* -----------------------------
      REQUEST INTERCEPTOR
------------------------------ */
axiosInstance.interceptors.request.use(
  (config) => {
    logger.debug("[Axios Request]", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    logger.error("[Axios Request Error]", error);
    return Promise.reject(error);
  }
);

/* -----------------------------
      RESPONSE INTERCEPTOR
------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug("[Axios Response]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    logger.error("[Axios Response Error]", error.response?.data || error.message);

    // Skip URLs for refresh/login/secure-check
    const skipUrls = [
      API_URLS.AUTH.LOGIN,
      API_URLS.AUTH.REFRESH,
      API_URLS.AUTH.SECURE_CHECK,
      API_URLS.AUTH.LOGOUT,
    ];

    if (!originalRequest || skipUrls.some((url) => originalRequest.url.endsWith(url))) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      window.dispatchEvent(new Event("force-logout"));
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post(API_URLS.AUTH.REFRESH);
        const { access_token } = res.data;

        if (!access_token) {
          window.dispatchEvent(new Event("force-logout"));
          return Promise.reject(error);
        }

        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        window.dispatchEvent(new Event("force-logout"));
        logger.error("[Token Refresh Failed]", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
