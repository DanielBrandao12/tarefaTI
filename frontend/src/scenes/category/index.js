import React, { useState, useEffect } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';

import api from '../../services/api';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import stylesGlobal from '../../styles/styleGlobal.module.css';
import style from './style.module.css';

function Category() {

    const [error, setError] = useState({ nomeCategoria: false, statusCategoria: false });
    const [titleForm, setTitleForm] = useState('Adicionar Categoria');
    const [showEdit, setShowEdit] = useState(false);
    const [idCategory, setIdCategory] = useState()
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [statusCategoria, setStatusCategoria] = useState('');
    const [isEditIconDisabled, setIsEditIconDisabled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [category, setCategory] = useState([])

    const handleStatusChange = (event) => {
        setStatusCategoria(event.target.value);
        setError((prev) => ({ ...prev, statusCategoria: false }));
    };

    const toggleEdit = (id, categoria, status) => {
        setIdCategory(id)
        setNomeCategoria(categoria);
        setStatusCategoria(status)
        setShowEdit(!showEdit);
        setIsEditIconDisabled(!isEditIconDisabled);
        setTitleForm('Editar Categoria');
    };

    const cancelEdit = () => {
        setShowEdit(false);
        setIsEditIconDisabled(false);
        setTitleForm('Adicionar Categoria');
        setNomeCategoria('');
        setStatusCategoria('');
    };


    const getAllCategory = async () => {
        try {
            const response = await api.get('/categoria/'); // Chama o endpoint para buscar categorias
            setCategory(response.data); // Armazena os dados na variável de estado
            setError(false); // Reseta o erro caso a requisição tenha sucesso
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setError(true); // Sinaliza que houve um erro
        }
    };

    useEffect(() => {
        getAllCategory(); // Chama a função ao montar o componente
    }, []); // O array vazio garante que a função será chamada apenas uma vez


    const createCategory = async () => {
        const hasError = !nomeCategoria || !statusCategoria;
        setError({
            nomeCategoria: !nomeCategoria,
            statusCategoria: !statusCategoria,
        });

        if (hasError) return;

        try {
            const response = await api.post('/categoria/createCategory', {
                nomeCategoria,
                statusCategoria,
            });
            const categoriaCriada = response.data;
            console.log(categoriaCriada);
           
           
            setModalMessage('Categoria adicionada com sucesso!');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
           
            setNomeCategoria('');
            setStatusCategoria('');
            await  getAllCategory()
            
        } catch (error) {
            console.error('Erro ao criar categoria', error);
        }
    };

    const editCategory = async () => {
        const hasError = !nomeCategoria || !statusCategoria;
        setError({
            nomeCategoria: !nomeCategoria,
            statusCategoria: !statusCategoria,
        });

        if (hasError) return;

        try {
            const response = await api.put('/categoria/editCategory', {
                idCategory,
                nomeCategoria,
                statusCategoria,
            });
            const categoriaEditada = response.data;
            console.log(categoriaEditada);
         
            cancelEdit()
            setModalMessage('Categoria editada com sucesso!');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);

            setNomeCategoria('');
            setStatusCategoria('');
           await getAllCategory()
        } catch (error) {
            console.error('Erro ao editar categoria', error);
        }
    }

    const deleteCategory = async (id, status) => {
        try {
            console.log(id, status);
    
            // Envia os parâmetros como query string
            const response = await api.delete(`/categoria/deleteCategory`, {
                params: { id, status },
            });
    
            if(status === 'Ativo'){
                setModalMessage('Categoria em uso, desative para excluir a categoria')
                setShowModal(true);
                setTimeout(() => setShowModal(false), 1000);
            }else{

                // Mensagem de sucesso no modal
                setModalMessage('Categoria excluída com sucesso!');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 3000);
        
                setNomeCategoria('');
                setStatusCategoria('');
                
                // Atualiza a lista de categorias
                await getAllCategory();
            }
    
        } catch (error) {
            console.error('Erro ao excluir categoria', error);
        }
    };
    


    function formatarDataHora(dataISO) {
        return dayjs(dataISO).format('DD/MM/YYYY HH:mm');
    }


    //Alterar o modal para o popup!!
    return (
        <PaginaPadrao>
            {/* Modal de mensagem */}
            {showModal && (
                <div className={style.modal}>
                    <p>{modalMessage}</p>
                </div>
            )}

            <div className={style.positionCard}>
                <div className={style.titleFormCatgory}>
                    <h3>{titleForm}</h3>
                </div>

                <div className={style.containerInputAdd}>
                    <label>Categoria</label>
                    <div className={style.containerMessageInput}>

                        <input
                            value={nomeCategoria}
                            className={[
                                style.inputConfig,
                                error.nomeCategoria && style.errorInput,
                            ].join(' ')}
                            onChange={(e) => {
                                setNomeCategoria(e.target.value);
                                setError((prev) => ({ ...prev, nomeCategoria: false }));
                            }}
                        />
                        {error.nomeCategoria && (
                            <span className={style.errorMessage}>Campo obrigatório</span>
                        )}
                    </div>

                    <label>Status</label>
                    <div className={style.containerMessageInput}>



                        <select
                            value={statusCategoria}
                            name="Categoria"
                            className={[
                                stylesGlobal.selectChamado,
                                error.statusCategoria && style.errorInput,
                            ].join(' ')}
                            onChange={handleStatusChange}
                        >
                            <option value="">Selecione Status</option>
                            <option value="Ativo">Ativar</option>
                            <option value="Desativado">Desativar</option>
                        </select>
                        {error.statusCategoria && (
                            <span className={style.errorMessage}>Escolha uma opção</span>
                        )}
                    </div>

                    {!showEdit ? (
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
                                onClick={()=> editCategory()}
                                className={stylesGlobal.buttonPadrao}
                            />
                            <input
                                type="button"
                                value="Cancelar"
                                className={stylesGlobal.buttonPadrao}
                                onClick={cancelEdit}
                            />
                        </div>
                    )}
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
                                    <th>Data - Hora</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className={stylesGlobal.tbody}>

                                {category.map((categorys) => (
                                    <tr key={category.id} style={{ cursor: 'auto' }}>



                                        <td>{categorys.id_categoria}</td>
                                        <td>{categorys.nome}</td>
                                        <td>{categorys.criado_por}</td>
                                        <td>{categorys.status}</td>
                                        <td>{formatarDataHora(categorys.data_criacao)}</td>

                                        <td className={style.tdIcones}>
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className={style.icon}
                                                onClick={!isEditIconDisabled ? () => toggleEdit(categorys.id_categoria, categorys.nome, categorys.status) : null}
                                                style={{
                                                    cursor: isEditIconDisabled ? 'not-allowed' : 'pointer',
                                                    pointerEvents: isEditIconDisabled ? 'none' : 'auto',
                                                }}
                                            />
                                            <FontAwesomeIcon icon={faTrashCan} className={style.icon} onClick={()=>deleteCategory(categorys.id_categoria, categorys.status)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PaginaPadrao>
    );
}

export default Category;
