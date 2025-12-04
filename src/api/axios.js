import axios from "axios";
const API = import.meta.env.VITE_API_URL;
console.log("API ", API);
let token = localStorage.getItem("jwt");

const api = axios.create({
  baseURL: API, // change to your backend base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  },
});

export default api;
