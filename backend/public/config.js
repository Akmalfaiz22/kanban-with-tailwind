const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "";

export default API_BASE_URL;