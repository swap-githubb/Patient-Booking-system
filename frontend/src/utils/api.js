import axios from 'axios';

const api = axios.create({
  baseURL: 'https://patient-booking-system.onrender.com' // Update this URL once your backend is deployed.
});

export default api;
