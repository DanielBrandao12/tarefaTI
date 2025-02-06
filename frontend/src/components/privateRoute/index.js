import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api'; // Importa a configuração do axios
import Cookies from 'js-cookie'; // Importa a biblioteca para acessar cookies

const PrivateRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            // Obter o token de autenticação dos cookies
            const token = Cookies.get('authToken'); // Supondo que o token esteja armazenado no cookie com o nome 'authToken'

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Adicionar o token ao cabeçalho da requisição
                const response = await api.get('/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Enquanto a verificação de autenticação não termina, exibe um "Loading..."
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
