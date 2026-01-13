import axios from 'axios';
// config
// import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  // baseURL: HOST_API,
  // baseURL: 'http://localhost:7777/api',
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Tambahkan interceptor request untuk menambahkan token ke header (sudah ditambahkan di file jwt.js)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // Tambahkan token ke header Authorization
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
