import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api'; // Importa a configuração do axios
const PrivateRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          await api.get('/');
          setIsAuthenticated(true);
        } catch {
          setIsAuthenticated(false);
        }
      };
      checkAuth();
    }, []);
  
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
      }
  return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;