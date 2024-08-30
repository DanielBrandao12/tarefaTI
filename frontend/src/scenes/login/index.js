import React from 'react'
import './style.css'

const Login = () => {
  return (
    <div>
        <div className='container-login'>
            <div className='div-form'>
                    <h1>Login</h1>
                <form>
                    <input className='input-login' type='text' placeholder='Usuário' required/>
                    <input className='input-login'  type='text' placeholder='Senha' required/>
                    <input className='input-login button-login'  type='submit' value='Entrar'/>

                </form>

            </div>
        </div>
    </div>
  )
}

export default Login
