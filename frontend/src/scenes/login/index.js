import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho conforme necessário

const Login = () => {
  const [nome_user, setNomeUser] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegação programática

  const handleLogin = async (e) => {
    e.preventDefault()
    
    setError(''); // Limpa o erro antes de tentar fazer o login
    try {
      if(!nome_user || !senha){
        setError('Preencha todos os campos!')
      }else{

        await api.post('/login', { nome_user, senha });
        navigate('/');
      }
      
    } catch (err) {
      console.error('Login failed:', err); // Log do erro
      setError('Credenciais inválidas');
      setSenha(''); // Limpa a senha, mas mantém o nome de usuário
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
            value={nome_user}
            onChange={(e) => setNomeUser(e.target.value)}
            placeholder='Nome de usuário'
            required
          />
          <input
            className='input-login'
            type='password'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Senha'
            required
          />
          <input
            className='input-login button-login'
            type='submit'
            value='Entrar'
          />
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
