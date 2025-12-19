import config from "../config/logger.config";

const logEnabled = config.enableLogs;
const debugEnabled = config.enableDebug;

// Sensitive keys
const sensitiveKeys = ["password", "token", "secret", "authorization"];

// Redact sensitive info
const redact = (obj) => {
  try {
    if (!obj || typeof obj !== "object") return obj;
    const clone = JSON.parse(JSON.stringify(obj));

    Object.keys(clone).forEach((k) => {
      if (sensitiveKeys.includes(k.toLowerCase())) {
        clone[k] = "***REDACTED***";
      }
    });

    return clone;
  } catch {
    return obj;
  }
};

// Timestamp
const ts = () => new Date().toISOString();

// -------------------------------------------------------------
// ✔ FIX: Save only last 200 logs to avoid localStorage overflow
// -------------------------------------------------------------
const save = (entry) => {
  if (config.environment !== "development") return;

  const MAX_LOGS = 200;

  let logs = JSON.parse(localStorage.getItem("APP_LOGS") || "[]");

  logs.push(entry);

  // 🔥 Trim logs array when it exceeds max size
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(logs.length - MAX_LOGS);   // keep only last 200
  }

  localStorage.setItem("APP_LOGS", JSON.stringify(logs));
};
// -------------------------------------------------------------

const logger = {
  info: (...msg) => {
    if (!logEnabled) return;
    console.log(
      "%c[INFO]",
      "color:#3498db;font-weight:bold",
      ...msg
    );
    save({ level: "info", time: ts(), msg });
  },

  success: (...msg) => {
    if (!logEnabled) return;
    console.log(
      "%c[SUCCESS]",
      "color:#2ecc71;font-weight:bold",
      ...msg
    );
    save({ level: "success", time: ts(), msg });
  },

  warn: (...msg) => {
    if (!logEnabled) return;
    console.warn(
      "%c[WARN]",
      "color:#f39c12;font-weight:bold",
      ...msg
    );
    save({ level: "warn", time: ts(), msg });
  },

  error: (...msg) => {
    console.error(
      "%c[ERROR]",
      "color:#e74c3c;font-weight:bold",
      ...msg
    );
    save({ level: "error", time: ts(), msg });
  },

  debug: (...msg) => {
    if (!debugEnabled) return;
    console.log(
      "%c[DEBUG]",
      "color:#9b59b6;font-weight:bold",
      ...msg
    );
    save({ level: "debug", time: ts(), msg });
  },

  object(label, obj) {
    if (!logEnabled) return;
    console.groupCollapsed(
      `%c[OBJECT] ${label}`,
      "color:#8e44ad;font-weight:bold"
    );
    console.log(redact(obj));
    console.groupEnd();
    save({ level: "object", time: ts(), label, obj: redact(obj) });
  },

  exception(err) {
    console.error(
      "%c[EXCEPTION]",
      "color:#c0392b;font-weight:bold",
      err.message,
      err.stack
    );
    save({ level: "exception", time: ts(), error: err.message });
  },

  timer: {
    start: (label) => debugEnabled && console.time(label),
    end: (label) => debugEnabled && console.timeEnd(label),
  },

  clear: () => localStorage.removeItem("APP_LOGS"),

  getStoredLogs: () => JSON.parse(localStorage.getItem("APP_LOGS") || "[]"),

  async sendToServer(payload) {
    if (!config.sendToServer) return;

    try {
      await fetch("http://localhost:8000/logs/frontend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          time: ts(),
          env: config.environment,
          app: config.appName,
        }),
      });
    } catch (err) {
      console.error("Logger failed sending logs");
    }
  },
};

export default logger;
