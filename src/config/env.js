const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const fallbackApiBaseUrl = "http://localhost:5000";

const configuredApiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (!configuredApiBaseUrl && process.env.NODE_ENV !== "production") {
  // Keep local development usable even before .env is created.
  // Production builds should still set REACT_APP_API_BASE_URL explicitly.
  console.warn(
    "REACT_APP_API_BASE_URL is not set. Falling back to http://localhost:5000."
  );
}

export const env = {
  appName: process.env.REACT_APP_APP_NAME || "Sub-Zero",
  apiBaseUrl: trimTrailingSlash(configuredApiBaseUrl || fallbackApiBaseUrl),
};

export const apiConfig = {
  generateShortUrl: `${env.apiBaseUrl}/generate`,
};
