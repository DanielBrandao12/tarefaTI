import React from 'react'
import Card from '../../components/card'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import style from './style.module.css'
import styleGlobal from '../../styles/styleGlobal.module.css'
function CriarChamadoUser() {
  return (
    <div className={style.containerFormChamado}>
      <Card >
      <h1 className={style.titleFormChamado}>Envie sua mensagem</h1>
        <form className={style.formChamado}>
    

          <div className={style.fieldGroup}>
            <label>Nome:</label>
            <input type='text' placeholder='Digite seu nome' className={style.inputTextChamado} />
          </div>
          <div className={style.fieldGroup}>
            <label>Email:</label>
            <input type='text' placeholder='Digite seu Email' className={style.inputTextChamado} />
          </div>

          <div className={style.fieldGroup}>
            <label>Assunto:</label>
            <input type='text' placeholder='Assunto' className={style.inputTextChamado} />
          </div>

          <div className={style.fieldGroup}>
            <label>Descrição:</label>
            <ReactQuill className={style.reactQuill} />
          </div>

       
          <button type='button' className={style.buttonEnviar}>Enviar</button>
        </form>
      </Card>
    </div>
  )
}

export default CriarChamadoUser



