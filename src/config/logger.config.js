const ENV = import.meta.env.VITE_ENV || "development";

const config = {
  environment: ENV,
  enableLogs: import.meta.env.VITE_ENABLE_LOGS === "true",
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === "true",
  sendToServer: ENV === "production", // send logs only in production
  appName: "Partner Learning Tracker",
};

export default config;
