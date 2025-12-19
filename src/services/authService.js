import authApi from "../api/authApi";
import logger from "../utils/logger";

const authService = {
  login: async (psa_id, password) => {
    try {
      const { data } = await authApi.login(psa_id, password);
      logger.success("[authService] login success", { psa_id });
      return data;
    } catch (err) {
      logger.error("[authService] login failed", { psa_id, err });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      logger.info("[authService] logout success");
    } catch (err) {
      logger.error("[authService] logout failed", err);
      throw err;
    }
  },

  secureCheck: async () => {
    try {
      const res = await authApi.secureCheck();
      logger.debug("[authService] secureCheck success", res.data);
      return res.data;
    } catch (err) {
      logger.warn("[authService] secureCheck failed", err);
      throw err;
    }
  },

  refresh: async () => {
    try {
      const res = await authApi.secureCheck();
      logger.debug("[authService] restoreSession success", res.data);
      return res.data;
    } catch {
      logger.warn("[authService] restoreSession failed");
      return null;
    }
  },
};

export default authService;
