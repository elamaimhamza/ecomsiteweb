import axios from "axios";
const API = import.meta.env.VITE_API_URL;
console.log("API ", API);
const api = axios.create({
  baseURL: API, // change to your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
