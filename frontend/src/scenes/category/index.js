import React, { useState } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';

import api from '../../services/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import stylesGlobal from '../../styles/styleGlobal.module.css';
import style from './style.module.css';

function Category() {
    const [test, setTest] = useState([])
    const [error, setError] = useState(false)
    const [titleForm, setTitleForm] = useState('Adicionar Categoria');
    const [showEdit, setShowEdit] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [statusCategoria, setStatusCategoria] = useState('');
    const [isEditIconDisabled, setIsEditIconDisabled] = useState(false); // Estado para desabilitar o ícone de edição

    // Função para lidar com a mudança de valor no select
    const handleStatusChange = (event) => {
        setStatusCategoria(event.target.value);
    };

    const toggleEdit = (categoria) => {
        setNomeCategoria(categoria)
        setShowEdit(!showEdit);
        setIsEditIconDisabled(!isEditIconDisabled); // Desabilita ou habilita o ícone de edição ao clicar
        setTitleForm('Editar Categoria')
    };

    const cancelEdit = () => {
        setShowEdit(false);
        setIsEditIconDisabled(false); // Habilita o ícone de edição ao cancelar
        setTitleForm('Adicionar Categoria')
        setNomeCategoria('')
    };
    const getCategorys = async () => {
       
    }

    const createCategory = async () => {
        try {
            if(nomeCategoria && statusCategoria){

                const response = await api.post('/categoria/createCategory', {nomeCategoria, statusCategoria});
                const categoriaCriada = response.data
                console.log(categoriaCriada)
               setTest(categoriaCriada)
            } else {
                //criar alerta nos inputs
                setError(true)
                return
            }
          } catch (error) {
            console.error('Erro ao buscar tarefas', error);
          }
    }
    const editCategory = () => {

    }

    const deleteCategory = () =>{

    }

    return (
        <PaginaPadrao>
            <div className={style.positionCard}>
                <div className={style.titleFormCatgory}>
                    <h3>{titleForm}</h3>
                </div>

                <div className={style.containerInputAdd}>
                    <label>Categoria</label>
                    <input
                        value={nomeCategoria}
                        className={[style.inputConfig , error && stylesGlobal.errorInput]}
                        onChange={(e)=> {setNomeCategoria(e.target.value)}}
                    />
                    <label>Status</label>
                    <select
                        value={statusCategoria}
                        name="Categoria"
                        className={stylesGlobal.selectChamado}
                        onChange={handleStatusChange}
                    >
                        <option value=''>Selecione Status</option>
                        <option value="Ativo">Ativar</option>
                        <option value="Desativado">Desativar</option>
                    </select>

                    {
                        !showEdit ? (
                            <input
                                type="button"
                                value={titleForm}
                                className={stylesGlobal.buttonPadrao}
                                onClick={createCategory}
                            />
                        ) : (
                            <div>
                                <input
                                    type="button"
                                    value="Salvar"
                                    className={stylesGlobal.buttonPadrao}
                                />
                                <input
                                    type="button"
                                    value="Cancelar"
                                    className={stylesGlobal.buttonPadrao}
                                    onClick={cancelEdit} // Chama a função para cancelar a edição
                                />
                            </div>
                        )
                    }
                </div>
            </div>

            <div className={style.containerSepara}>
                <Card>
                    <div>
                        <table className={stylesGlobal.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Criado por</th>
                                    <th>Status</th>
                                    <th>Data</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className={stylesGlobal.tbody}>
                                <tr style={{ cursor: 'auto' }}>
                                    <td>001</td>
                                    <td>Software</td>
                                    <td>Daniel</td>
                                    <td>Ativo</td>
                                    <td>07-10-2024</td>
                                    <td className={style.tdIcones}>
                                        {/* Desabilita o ícone de edição se isEditIconDisabled for true */}
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className={style.icon}
                                            onClick={!isEditIconDisabled ? ()=>toggleEdit('Software') : null} // Impede o clique se o ícone estiver desabilitado
                                            style={{
                                                cursor: isEditIconDisabled ? 'not-allowed' : 'pointer',
                                                pointerEvents: isEditIconDisabled ? 'none' : 'auto' // Desabilita o clique no ícone
                                            }}
                                        />
                                        <FontAwesomeIcon icon={faTrashCan} className={style.icon} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PaginaPadrao>
    );
}

export default Category;
