import axios from "axios"

const api = axios.create({
   
   baseURL: "http://servicedesk:3333",
  
    withCredentials: true, // Permite que os cookies sejam enviados e recebidos
  

});


export default api;