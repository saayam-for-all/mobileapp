import axios from "axios";
import Auth from "@aws-amplify/auth";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
  
// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Refresh token if expired
    try {    
      // Modify the request config (e.g., add headers) 
      // config.headers.Authorization = 'Bearer YOUR_TOKEN';
      const session = ((await Auth.currentSession()));
      //let token = session.getIdToken().getJwtToken();
      //console.log ('token api', token)
      const idTokenExpire = session.getIdToken().getExpiration();
      const currentTimeSeconds = Math.round(+new Date() / 1000);
      if (idTokenExpire < currentTimeSeconds) {
        const user = await Auth.currentAuthenticatedUser();
        const refreshToken = session.getRefreshToken();
        
        // Wrap refreshSession callback in Promise
        const newSession = await new Promise((resolve, reject) => {
          user.refreshSession(refreshToken, (err, data) => {
            if (err) {
              console.error('Error refreshing token:', err);
              reject(err);
            } else {
              console.log('Token refreshed successfully');
              resolve(data);
            }
          });
        });
        console.log('Successfully refreshed token');
        config.headers.Authorization = newSession.getIdToken().getJwtToken();
        return config;
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
    } catch (error) {
      
      console.error('Error in request interceptor:', error);
      try {
        await Auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
      
      return Promise.reject({
        message: 'Authentication failed',
        originalError: error,
        requiresLogin: true,
      });
    }
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
  
);

//Response interceptor
api.interceptors.response.use(
  (response) => {
    //Modify the response data
    // response.data = transformData(response.data);
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);
export default api;
