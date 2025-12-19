import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import API_URLS from "../config/apiUrls";
import { useNavigate } from "react-router-dom";
import logger from "../utils/logger";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_URLS.AUTH.SECURE_CHECK);
      setUser(res.data);
      setIsAuthenticated(true);
      logger.success("[Auth] Secure check passed", res.data);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      logger.warn("[Auth] Secure check failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (psa_id, password) => {
    try {
      await axiosInstance.post(API_URLS.AUTH.LOGIN, { psa_id, password });
      logger.success(`[Auth] Login success for PSA=${psa_id}`);
      await checkAuth();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      logger.error(`[Auth] Login failed for PSA=${psa_id}`, err);
      throw err;
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post(API_URLS.AUTH.LOGOUT);
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
      logger.info("[Auth] User logged out");
    } catch (err) {
      logger.error("[Auth] Logout failed", err);
    }
  }, [navigate]);

  useEffect(() => {
    const handler = () => {
      logger.warn("[Auth] Force logout triggered");
      logout();
    };
    window.addEventListener("force-logout", handler);
    return () => window.removeEventListener("force-logout", handler);
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
