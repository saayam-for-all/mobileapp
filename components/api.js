import axios from "axios";

const api = axios.create(
    {
        baseURL: "https://my-json-server.typicode.com/",//Example url for testing
        headers: {
          "Content-Type": "application/json",
        },
      
    });

   // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Modify the request config (e.g., add headers)
        // config.headers.Authorization = 'Bearer YOUR_TOKEN';
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