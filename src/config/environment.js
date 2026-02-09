const APP_ENV =
  import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "local";

const normalizeBaseUrl = (url) =>
  typeof url === "string" ? url.replace(/\/+$/, "") : "";

const RESOLVED_BASE_URL = (() => {
  const candidates = {
    local:
      import.meta.env.VITE_API_BASE_URL_LOCAL ||
      import.meta.env.VITE_API_BASE_URL,
    staging:
      import.meta.env.VITE_API_BASE_URL_STAGING ||
      import.meta.env.VITE_API_BASE_URL,
    production:
      import.meta.env.VITE_API_BASE_URL_PRODUCTION ||
      import.meta.env.VITE_API_BASE_URL,
  };

  const explicit = candidates[APP_ENV];
  if (explicit) {
    return normalizeBaseUrl(explicit);
  }

  // const fallback =
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:9184";
  // return normalizeBaseUrl(fallback);
})();

export const environment = Object.freeze({
  env: APP_ENV,
  apiBaseUrl: RESOLVED_BASE_URL,
});

export const buildApiUrl = (path = "") => {
  if (!path) {
    return RESOLVED_BASE_URL;
  }

  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${RESOLVED_BASE_URL}${suffix}`;
};
