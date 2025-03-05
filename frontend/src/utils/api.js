import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // Update this URL once your backend is deployed.
});

export default api;
