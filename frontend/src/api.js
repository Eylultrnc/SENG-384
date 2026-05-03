const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    // Remove any invalid characters like newlines or carriage returns
    token = token.trim().replace(/[^\x20-\x7E]/g, '');
    headers.Authorization = `Bearer ${token}`;
  }

  // Prevent double /api/api
  const baseUrl = API_URL.endsWith('/api') && endpoint.startsWith('/api') 
    ? API_URL.slice(0, -4) 
    : API_URL;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
