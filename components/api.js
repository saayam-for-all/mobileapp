import axios from "axios";
import Auth from "@aws-amplify/auth";

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
        const session = ((await Auth.currentSession()));
        //let token = session.getIdToken().getJwtToken();
        //console.log ('token api', token)
        const idTokenExpire = session.getIdToken().getExpiration();
        const refreshToken = session.getRefreshToken();
        const currentTimeSeconds = Math.round(+new Date() / 1000);
        if (idTokenExpire < currentTimeSeconds) {
          Auth.currentAuthenticatedUser()
            .then((user) => {
              user.refreshSession(refreshToken, (err, data) => {
                if (err) {
                  console.log('Error refreshing token', err);
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
