import axios from "axios"

const api = axios.create({
   // baseURL: "http://10.68.96.11:3333",
   //baseURL: "http://servicedesk:3333",
    baseURL: "http://localhost:3333",
    withCredentials: true, // Permite que os cookies sejam enviados e recebidos
  

});


export default api;