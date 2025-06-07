import axios from "axios";

// In production, we need to specify the full URL with port
const getBaseURL = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:4000/api/v1";
  }
  
  // In production, use the actual backend URL with port
  // This assumes your backend is accessible on the same domain but different port
  return `${window.location.protocol}//${window.location.hostname}:4000/api/v1`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});