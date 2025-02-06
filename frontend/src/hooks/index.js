import { useEffect, useState } from "react";
import api from "../services/api"; // Sua instância de Axios

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/verify/check", { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};

export default useAuth;
