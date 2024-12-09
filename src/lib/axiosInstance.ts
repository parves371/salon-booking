import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: '/api',  // You can change this to your backend URL if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
