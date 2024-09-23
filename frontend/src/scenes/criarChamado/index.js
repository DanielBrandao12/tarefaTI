import React from 'react'
import styles from './style.module.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importar o estilo

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/header'
import Menu from '../../components/menu'

import Card from '../../components/card'
import PaginaPadrao from '../../components/paginaPadrao'

function criarChamado() {
  return (
    <PaginaPadrao>
      <Card>
        <h1 className={styles.titleFormChamado}>Crie um chamado</h1>
        <form className={styles.formChamado}>

          <div className={styles.colunasInput}>
            <div>
              <label>Categoria:</label>
              <select
                name='Categoria'
                className={styles.selectChamado}

              >
                <option value='' disabled selected>Selecione Categoria</option>
                <option value='Hardware'>Hardware</option>
                <option value='Software'>Software</option>
                <option value='Infraestrutura'>Infraestrutura</option>
                <option value='Rede'>Rede</option>
                <option value='Plataformas Acadêmicas'>Plataformas Acadêmicas</option>
              </select>
            </div>
            <div>

              <label>Prioridade:</label>
              <select
                className={styles.selectChamado}
                name='Nível de prioridade'
              >
                <option value='' disabled>Nível de prioridade</option>
                <option value='Prioridade Baixa'>Baixa</option>
                <option value='Prioridade Média'>Média</option>
                <option value='Prioridade Alta'>Alta</option>
              </select>
            </div>

          </div>
          <div className={styles.containerName}>

            <label>Nome:</label>
            <input type='text' placeholder='Digite seu nome' className={styles.inputTextChamado} />
          </div>

          <label>Status:</label>
          <select
            name='Status'
            className={styles.selectChamado}
          >
            <option value='' disabled>Status</option>
            <option value='Aguardando classificação'>Aguardando classificação</option>
            <option value='Em atendimento'>Em atendimento</option>
            <option value='Suspenso'>Suspenso</option>
            <option value='Fechado'>Fechado</option>
          </select>
          <label>Assunto:</label>
          <input type='text' placeholder='Assunto' className={styles.inputTextChamado} />
          <label>Descrição:</label>
          <ReactQuill />

          <label>Criar Lista de Tarefas:</label>
          <input type='text' placeholder='Digite a tarefa' className={styles.inputTextChamado} />
          <label>Atribuir para:</label>
          <select
            name='Atribuir:'
            className={styles.selectChamado}
          >
            <option value='' disabled>Atribuir para</option>
            <option value='Daniel'>Daniel</option>
            <option value='Márcio'>Márcio</option>
            <option value='Wilson'>Wilson</option>
            <option value='Clayton'>Clayton</option>
          </select>
          <input type='button' value='Enviar' className='button-padrao' />
        </form>
      </Card>


    </PaginaPadrao>
  )
}

export default criarChamado
