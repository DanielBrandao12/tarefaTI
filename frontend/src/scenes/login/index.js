import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho conforme necessário
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie

const Login = () => {
  const [nome_usuario, setNomeUsuario] = useState('');
  const [senha_hash, setSenhaHash] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegação programática

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(''); // Limpa o erro antes de tentar fazer o login
    try {
      if (!nome_usuario || !senha_hash) {
        setError('Preencha todos os campos!');
      } else {
        // Fazendo a requisição para o backend
        const response = await api.post('/login', { nome_usuario, senha_hash });

        // Supondo que o backend retorne um token ao fazer o login
        const token = response.data.token; // Ajuste conforme o formato da resposta do backend

        // Armazenando o token nos cookies
        Cookies.set('authToken', token, { expires: 1 }); // O token expira em 1 dia, ajuste conforme necessário

        // Redirecionando para a página principal (ou outra página após o login)
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err); // Log do erro
      setError('Credenciais inválidas');
      setSenhaHash(''); // Limpa a senha, mas mantém o nome de usuário
    }
  };

  return (
    <div className='container-login'>
      <div className='div-form'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            className='input-login'
            type='text'
            value={nome_usuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
            placeholder='Nome de usuário'
            required
          />
          <input
            className='input-login'
            type='password'
            value={senha_hash}
            onChange={(e) => setSenhaHash(e.target.value)}
            placeholder='Senha'
            required
          />
          <input
            className='input-login button-login'
            type='submit'
            value='Entrar'
          />
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
