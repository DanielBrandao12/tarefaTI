import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './style.module.css';
import stylesGlobal from '../../styles/styleGlobal.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/card';
import PaginaPadrao from '../../components/paginaPadrao';

function CriarChamado() {

  const id_ticket = useParams(); // Captura o parâmetro da URL
  const [tarefa, setTarefa] = useState('');
  const [listaTarefa, setListaTarefa] = useState([]);

  const addItemLista = () => {
    if (!tarefa.trim()) {
      alert("A tarefa não pode estar vazia!");
      return;
    }

    setListaTarefa((prevLista) => [...prevLista, tarefa]);
    setTarefa(''); // Limpa o campo de entrada após adicionar a tarefa
  };

  const removeItemLista = (indexToRemove) => {
    setListaTarefa((prevLista) => prevLista.filter((_, index) => index !== indexToRemove));
  };

  return (
    <PaginaPadrao>
      <Card>
        <h1 className={styles.titleFormChamado}>{id_ticket.id ? 'Editar Chamado' : 'Abrir Chamado'}</h1>
        <form className={styles.formChamado}>
          <div className={styles.fieldGroup}>
            <label>Categoria:</label>
            <select name='Categoria' className={stylesGlobal.selectChamado}>
              <option value='' disabled>Selecione Categoria</option>
              <option value='Hardware'>Hardware</option>
              <option value='Software'>Software</option>
              <option value='Infraestrutura'>Infraestrutura</option>
              <option value='Rede'>Rede</option>
              <option value='Plataformas Acadêmicas'>Plataformas Acadêmicas</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Nome Requisitante:</label>
            <input type='text' placeholder='Digite o nome' className={stylesGlobal.inputTextChamado} />
          </div>
          <div className={styles.fieldGroup}>
            <label>Email Requisitante:</label>
            <input type='email' placeholder='Digite o email' className={stylesGlobal.inputTextChamado} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Assunto:</label>
            <input type='text' placeholder='Assunto' className={stylesGlobal.inputTextChamado} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Descrição:</label>
            <ReactQuill className={styles.reactQuill} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Criar Lista de Tarefas:</label>
            <div className={stylesGlobal.containerInputAdd}>
              <input
                type="text"
                placeholder="Digite a tarefa"
                className={stylesGlobal.inputTextChamado}
                value={tarefa}
                onChange={(e) => setTarefa(e.target.value)} // Atualiza o estado conforme o usuário digita
              />
              <div className={stylesGlobal.containerIconPlus}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={stylesGlobal.positionIconPlus}
                  onClick={addItemLista} // Chama a função para adicionar a tarefa
                />
              </div>
            </div>

            {/* Renderiza a lista de tarefas */}
            <div>
              {listaTarefa.length > 0 ? (
                <div className={stylesGlobal.itemLista}>
                  {listaTarefa.map((item, index) => (
                    <div key={index} className={stylesGlobal.itemListaItem}>
                      <span>{item}</span>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={stylesGlobal.removeIcon}
                        onClick={() => removeItemLista(index)} // Remove o item clicado
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <span>Nenhuma tarefa adicionada.</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Prioridade:</label>
            <select name='Nível de prioridade' className={stylesGlobal.selectChamado}>
              <option value='' disabled selected>Nível de prioridade</option>
              <option value='Prioridade Baixa'>Baixa</option>
              <option value='Prioridade Média'>Média</option>
              <option value='Prioridade Alta'>Alta</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Status:</label>
            <select name='Status' className={stylesGlobal.selectChamado}>
              <option value='' disabled selected>Status</option>
              <option value='Aguardando classificação'>Aguardando classificação</option>
              <option value='Em atendimento'>Em atendimento</option>
              <option value='Suspenso'>Suspenso</option>
              <option value='Fechado'>Fechado</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Atribuir para:</label>
            <select name='Atribuir' className={stylesGlobal.selectChamado}>
              <option value='' disabled>Atribuir para</option>
              <option value='Daniel'>Daniel</option>
              <option value='Márcio'>Márcio</option>
              <option value='Wilson'>Wilson</option>
              <option value='Clayton'>Clayton</option>
            </select>
          </div>
          {
            !id_ticket.id ? <button type='button' className={styles.buttonEnviar}>Enviar</button> :
              <button type='button' className={styles.buttonEnviar}>Salvar</button>
          }

        </form>
      </Card>
    </PaginaPadrao>
  );
}

export default CriarChamado;
