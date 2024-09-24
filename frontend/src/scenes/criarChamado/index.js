import React from 'react';
import styles from './style.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/card';
import PaginaPadrao from '../../components/paginaPadrao';

function CriarChamado() {
  return (
    <PaginaPadrao>
      <Card>
        <h1 className={styles.titleFormChamado}>Crie um chamado</h1>
        <form className={styles.formChamado}>
          <div className={styles.fieldGroup}>
            <label>Categoria:</label>
            <select name='Categoria' className={styles.selectChamado}>
              <option value='' disabled>Selecione Categoria</option>
              <option value='Hardware'>Hardware</option>
              <option value='Software'>Software</option>
              <option value='Infraestrutura'>Infraestrutura</option>
              <option value='Rede'>Rede</option>
              <option value='Plataformas Acadêmicas'>Plataformas Acadêmicas</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Nome:</label>
            <input type='text' placeholder='Digite seu nome' className={styles.inputTextChamado} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Assunto:</label>
            <input type='text' placeholder='Assunto' className={styles.inputTextChamado} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Descrição:</label>
            <ReactQuill className={styles.reactQuill} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Criar Lista de Tarefas:</label>
            <div className={styles.containerInputAdd}>
              <input type='text' placeholder='Digite a tarefa' className={styles.inputTextChamado} />
              <div className={styles.containerIconPlus}>
                  <FontAwesomeIcon icon={faPlus} className={styles.positionIconPlus}/>
              </div>
            </div>
            {/*aqui vai ficar a lista caso for criado lista */}
          </div>


          <div className={styles.fieldGroup}>
            <label>Prioridade:</label>
            <select name='Nível de prioridade' className={styles.selectChamado}>
              <option value='' disabled selected>Nível de prioridade</option>
              <option value='Prioridade Baixa'>Baixa</option>
              <option value='Prioridade Média'>Média</option>
              <option value='Prioridade Alta'>Alta</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Status:</label>
            <select name='Status' className={styles.selectChamado}>
              <option value='' disabled selected>Status</option>
              <option value='Aguardando classificação'>Aguardando classificação</option>
              <option value='Em atendimento'>Em atendimento</option>
              <option value='Suspenso'>Suspenso</option>
              <option value='Fechado'>Fechado</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Atribuir para:</label>
            <select name='Atribuir' className={styles.selectChamado}>
              <option value='' disabled>Atribuir para</option>
              <option value='Daniel'>Daniel</option>
              <option value='Márcio'>Márcio</option>
              <option value='Wilson'>Wilson</option>
              <option value='Clayton'>Clayton</option>
            </select>
          </div>

          <button type='button' className={styles.buttonEnviar}>Enviar</button>
        </form>
      </Card>
    </PaginaPadrao>
  );
}

export default CriarChamado;
