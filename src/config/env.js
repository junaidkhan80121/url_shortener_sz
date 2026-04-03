const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const requiredFrontendEnv = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
};

const missingEntries = Object.entries(requiredFrontendEnv)
  .filter(([, value]) => !value || !String(value).trim())
  .map(([key]) => key);

if (missingEntries.length > 0) {
  throw new Error(
    `Missing required frontend environment variables: ${missingEntries.join(", ")}`
  );
}

export const env = {
  appName: process.env.REACT_APP_APP_NAME || "Sub-Zero",
  apiBaseUrl: trimTrailingSlash(process.env.REACT_APP_API_BASE_URL),
};

export const apiConfig = {
  generateShortUrl: `${env.apiBaseUrl}/generate`,
};
