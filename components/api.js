import axios from "axios";
import Auth from '@aws-amplify/auth'

const api = axios.create(
    {
        baseURL: process.env.EXPO_PUBLIC_API_URL,//Example url for testing
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
        let token = session.getIdToken().getJwtToken();
        //console.log ('token api', token)
        if (token) {
          config.headers['Authorization'] =  token; 
         // console.log('header', config.headers.Authorization)
        }
     return config;
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