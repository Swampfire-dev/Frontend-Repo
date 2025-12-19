const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

const API_URLS = {
  BASE: BASE_URL,

  AUTH: {
    LOGIN: `${BASE_URL}/auth/token/login/`,
    SECURE_CHECK: `${BASE_URL}/auth/token/secure-check/`,
    REFRESH: `${BASE_URL}/auth/token/refresh-token/`,
    LOGOUT: `${BASE_URL}/auth/token/logout/`,
  },

  CERTIFICATE: {
    CREATE: `${BASE_URL}/certificate/create/`,
    LIST: `${BASE_URL}/certificate/list/`,
    ME: `${BASE_URL}/certificate/me/`,
    DETAIL: (cert_id) => `${BASE_URL}/certificate/${cert_id}/`,
    PARTNER_LIST: (psa_id) => `${BASE_URL}/certificate/psa/${psa_id}/`,
    STATS: `${BASE_URL}/certificate/stats/`,
    TRENDS: `${BASE_URL}/certificate/trends/`,
    DOMAINTRENDS: `${BASE_URL}/certificate/domaintrends/`,
  },

  TRAINING: {
    CREATE: (psa_id) => `${BASE_URL}/training/upload-csv/${psa_id}/`,
    LIST: `${BASE_URL}/training/list/`,
    ME: `${BASE_URL}/certificate/me/`,
    DETAIL: (cert_id) => `${BASE_URL}/certificate/${cert_id}/`,
    PARTNER_LIST: (psa_id) => `${BASE_URL}/certificate/psa/${psa_id}/`,
    STATS: `${BASE_URL}/training/stats/`,
    TRENDS: `${BASE_URL}/certificate/trends/`,
    DOMAINTRENDS: `${BASE_URL}/certificate/domaintrends/`,
  },
};

export default API_URLS;
