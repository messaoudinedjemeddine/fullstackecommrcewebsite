// utils/api.ts
import axios from 'axios';

// Create an Axios instance with a base URL for your backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Express backend API base URL
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
  },
  // You might add other configurations here, like timeout or authentication tokens later
});

export default api;