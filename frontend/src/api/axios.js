// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.241.222:5000/", // 👈 use LAN IP, not `/api`
  withCredentials: true,
});

export default api;


