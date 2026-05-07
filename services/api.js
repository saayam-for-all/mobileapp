import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import AuthHandler from "../global/authHandler";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.toString();
  } catch (error) {
    console.log("Error fetching token:", error);
    return null;
  }
};

const getRefreshedToken = async () => {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    return session?.tokens?.idToken?.toString();
  } catch (error) {
    console.log("Error refreshing token:", error);
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedRequestqueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestqueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `${token}`;
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newToken = await getRefreshedToken();
        if (!newToken) {
          console.log("Error refreshing token. Logging Out..");
          AuthHandler.signOut();
          return Promise.reject(error);
        }
        failedRequestqueue.forEach((p) => p.resolve(newToken));
        failedRequestqueue = [];
        originalRequest.headers.Authorization = `${newToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError);
        failedRequestqueue.forEach((p) => p.reject(refreshError));
        failedRequestqueue = [];
        AuthHandler.signOut();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;