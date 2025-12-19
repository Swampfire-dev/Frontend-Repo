import axiosInstance from "../utils/axiosInstance";
import API_URLS from "../config/apiUrls";

const authApi = {
  // LOGIN: backend sets HttpOnly cookies
  login: (psa_id, password) =>
    axiosInstance.post(API_URLS.AUTH.LOGIN, { psa_id, password }),

  // LOGOUT: backend clears HttpOnly cookies
  logout: () => axiosInstance.post(API_URLS.AUTH.LOGOUT),

  // REFRESH TOKEN: backend reads refresh cookie and sets new access token cookie
  refresh: () => axiosInstance.post(API_URLS.AUTH.REFRESH),

  // SECURE CHECK: validate access token cookie
  secureCheck: () => axiosInstance.get(API_URLS.AUTH.SECURE_CHECK),
};

export default authApi;
