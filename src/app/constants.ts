/** Base URL for API (no trailing slash). Use NEXT_PUBLIC_API_BASE_URL to override. */
export const API_BASE_URL = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL)
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")
  : "https://api.myjurist.io";


