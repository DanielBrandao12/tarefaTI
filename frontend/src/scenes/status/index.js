import React, { useState, useEffect } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';

import api from '../../services/api';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import stylesGlobal from '../../styles/styleGlobal.module.css';
import style from './style.module.css';

function Status() {
     const [error, setError] = useState(false);
     const [status, setStatus] = useState([])


      useEffect(() => {


          const getAllStatus = async () => {
              try {
                  const response = await api.get('/status/'); // Chama o endpoint para buscar categorias
                  setStatus(response.data); // Armazena os dados na variável de estado
                  setError(false); // Reseta o erro caso a requisição tenha sucesso
              } catch (error) {
                  console.error('Erro ao buscar status:', error);
                  setError(true); // Sinaliza que houve um erro
              }
          };

             getAllStatus(); 
             console.log(status)
         }, []);



    //Alterar o modal para o popup!!
    return (
        <PaginaPadrao>


            <div className={style.containerAddStatus}>
                <div>
                    <h3>Adicionar Status</h3>
                </div>
                <div className={style.containerInputs}>
                    <label>Status</label>
                    <div>
                        <input className={stylesGlobal.inputTextChamado} />
                    </div>
                    <label>Situação</label>
                    <div>
                        <select className={stylesGlobal.selectChamado} >
                            <option value=''>Escolha uma opção</option>
                            <option value='Ativo'>Ativar</option>
                            <option value='Desativado'>Desativar</option>
                        </select>
                    </div>
                    <input
                        type="button"
                        value={'Adicionar Status'}
                        className={stylesGlobal.buttonPadrao}

                    />
                </div>

            </div>


            <Card>
                <div>
                    <table className={stylesGlobal.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>Situação</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody className={stylesGlobal.tbody}>
                               {status.map((item) => (
                                     <tr key={item.id_status} >
                        
                                <td>{item.id_status}</td>
                                <td>{item.nome}</td>
                                <td>{item.ativo ? 'Ativado' : 'Desativado'}</td>

                                <td >
                                    <FontAwesomeIcon icon={faEdit} />
                                </td>
                            </tr>
                               ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </PaginaPadrao>
    );
}

export default Status;
