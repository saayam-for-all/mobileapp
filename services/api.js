import axios from "axios";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";

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

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Modify the request config (e.g., add headers) 
    // config.headers.Authorization = 'Bearer YOUR_TOKEN';
    const session = ((await Auth.currentSession()));
    //let token = session.getIdToken().getJwtToken();
    //console.log ('token api', token)
    idTokenExpire = session.getIdToken().getExpiration();
    refreshToken = session.getRefreshToken();
    currentTimeSeconds = Math.round(+new Date() / 1000);
    if (idTokenExpire < currentTimeSeconds) {
      Auth.currentAuthenticatedUser()
        .then((res) => {
          res.refreshSession(refreshToken, (err, data) => {
            if (err) {
              Auth.signOut()
            } else {
              config.headers.Authorization = data.getIdToken().getJwtToken();
              //console.log('Token refreshed')
              return config;
            }
          });
        });
    } else {
      config.headers.Authorization = session.getIdToken().getJwtToken();
      //console.log('no refresh', idTokenExpire + ' ' + currentTimeSeconds)
      return config;
    }

    /*  if (token) {
        config.headers['Authorization'] =  token; 
       // console.log('header', config.headers.Authorization)
      }
   return config;*/
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
        const newToken = await getToken();
        if (!newToken) {
          console.log("Error refreshing token. Logging Out..");
          signOut();
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
        signOut();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }

);

export default api;
