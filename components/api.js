import axios from "axios";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";

const api = axios.create(
    {
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: {
          "Content-Type": "application/json",
        },
      
    });
  
   // Request interceptor
  api.interceptors.request.use(
    async (config) => {    
      // Modify the request config (e.g., add headers) 
        // config.headers.Authorization = 'Bearer YOUR_TOKEN';
        const session = await fetchAuthSession();
        //let token = session.tokens?.idToken?.toString();
        //console.log ('token api', token)
        idTokenExpire = session.tokens?.idToken?.payload?.exp;
        refreshToken = session.tokens?.refreshToken;
        currentTimeSeconds = Math.round(+new Date() / 1000);
        if (idTokenExpire < currentTimeSeconds) {
          getCurrentUser()
            .then(async (res) => {
              try {
                const refreshedSession = await fetchAuthSession({ forceRefresh: true });
                config.headers.Authorization = refreshedSession.tokens?.idToken?.toString();
                //console.log('Token refreshed')
                return config;
              } catch (err) {
                await signOut();
              }
            });
        } else {
          config.headers.Authorization = session.tokens?.idToken?.toString();
          //console.log('no refresh', idTokenExpire + ' ' + currentTimeSeconds)
          return config;
        }    

      /*  if (token) {
          config.headers['Authorization'] =  token; 
         // console.log('header', config.headers.Authorization)
        }
     return config;*/
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