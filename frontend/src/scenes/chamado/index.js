import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styles from './style.module.css'
import stylesGlobal from '../../styles/styleGlobal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPenToSquare, faPrint, faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'



import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ExpandirLista from '../../components/expandirLista';

import api from '../../services/api';

function Chamado() {

  const { id_ticket } = useParams(); // Captura o parâmetro da URL
  const [chamado, setChamado] = useState('')
  const [listaTarefaTicket, setListaTarefaTicket] = useState([])
  const [status, setStatus] = useState('')
  const [categoria, setCategoria] = useState('')
  const [respostas, setRespostas] = useState('')

  //Get para chamado por id
  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const response = await api.get(`/tickets/${id_ticket}`);
        setChamado(response.data.ticket);
        console.log(response.data)
        if(response.data.respostas.length > 0){
          setRespostas(response.data.respostas)
        }
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    };
    fetchChamado()

  }, []);
  //Get para lista de tarefas pelo id do chamado
  useEffect(() => {

    const fetchChamadoListaTarefa = async () => {
      try {
        const response = await api.get(`/tickets/listaTarefa/${id_ticket}`);
        setListaTarefaTicket(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    };


    fetchChamadoListaTarefa()
  }, []);
  //get para pegar status do ticket
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        console.log(chamado.id_status)
        const response = await api.get(`/status/${chamado.id_status}`);
        setStatus(response.data.nome);
        console.log(response.data)

      } catch (error) {
        console.error('Erro ao buscar status:', error);
      }
    };
    fetchStatus()

  }, [chamado]);
  //Get para pegar categoria do ticket
  useEffect(() => {
    const fetchCategoria = async () => {
      try {

        const response = await api.get(`/categoria/${chamado.id_categoria}`);
        setCategoria(response.data.nome);
        console.log(response.data)

      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
      }
    };
    fetchCategoria()

  }, [chamado]);


  function formatarData(data) {
    const date = new Date(data); // Cria um objeto Date
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }

  const [openSelect, setOpenSelect] = useState(null);

  const toggleSelect = (index) => {

    if (openSelect === index) {
      setOpenSelect(null);  // Fecha o dropdown se ele já estiver aberto
    } else {
      setOpenSelect(index);  // Abre o dropdown clicado e fecha os outros
    }
  };

//criar função para editar mensagem enviada

  return (

    <PaginaPadrao >

      <div className={styles.containerDivCards}>
        <div className={styles.containerFirstCard}>
          {/*Assunto principal do chamado */}
          <Card>
            <div className={styles.containerChamadoView}>

              <h3 className={styles.titleAssunto}>{chamado.assunto}</h3>
              <div className={styles.autor}>
                <span className={styles.span}>Enviado por:</span>
                <p className={stylesGlobal.paragrafoGlobal}>{chamado.nome_requisitante}</p>
              </div>
              <p className={stylesGlobal.paragrafoGlobal}>{chamado.descricao}</p>

            </div>


          </Card>

          {/*Card de lista de tarefas */}
          <Card>

            <div className={styles.containerListaTarefas}>

              <h3 className={styles.titleLista}>Lista de Tarefas</h3>

              <div className={styles.containerCheckboxes}>
                {
                  !listaTarefaTicket.length ? <span>Não existe tarefas</span>
                    : listaTarefaTicket.map((item) => (

                      <label>
                        <input type="checkbox" value="opcao1" className={styles.checkBox} />{item.assunto}
                      </label>
                    ))
                }




              </div>

            </div>


          </Card>

          <ExpandirLista title={'Respostas do chamado'}>

            {/*Card respostas */}
            {
              !respostas.length ? <span>Não existe respostas</span>
              : respostas.map((item)=>(
                <Card>
                <div className={styles.responsesCard}>
                  <div className={styles.responsesCardDivFirst}>
  
                    <div><p>Enviado por <span>{!item.id_usuario?item.nome_requisitante: item.nome_usuario} - </span></p></div>
  
                    <div className={styles.editPrintContainer}>
                      <div>
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Editar</span>
                      </div>
                      
                    </div>
                  </div>
                  <div className={styles.divisao}></div>
                  <div className={styles.responsesCardDivTwo}>
                    <p className={stylesGlobal.paragrafoGlobal}></p>
                    <p>{item.conteudo}</p>
                    
                  </div>
                </div>
              </Card>
              )) 
       
            }
           


            {/*Card respostas */}
          </ExpandirLista>

          <Card>
            <div className={styles.containerListaTarefas}>
              <h3>Envie uma respota</h3>
              <ReactQuill className={styles.reactQuill} />
              <div>
                <input type='button' className='button-padrao' value={'Enviar'} />
              </div>

            </div>
          </Card>
        </div>
        <div className={styles.containerSecondCard}>
          <Card>
            <div className={styles.editPrintContainer}>
              <div>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Editar</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faPrint} />
                <span>Imprimir</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className={styles.containerDivFirst}>
              <span className={styles.titleLista}>Detalhes do Chamado</span>
            </div>
            <div className={styles.containerDivTwo}>

              <div>

                <span>Código do Ticket:</span>
                <span className={styles.spanDetalhes}>{chamado.codigo_ticket}</span>

              </div>
              <div>

                <span>Data e Hora Criação:</span>
                <span className={styles.spanDetalhes}>{formatarData(chamado.data_criacao)}</span>

              </div>

              {
                chamado.data_conclusao && <div>
                  <span>Data e Hora Conclusão:</span>
                  <span className={styles.spanDetalhes}>{formatarData(chamado.data_conclusao)}</span>

                </div>
              }
              <div>
                <span>Status:</span>
                <span className={styles.spanDetalhes}>{status}</span>
              </div>
              <div>
                <span>Categoria:</span>
                <span className={styles.spanDetalhes}>{categoria}</span>
              </div>
              <div>
                <span>Prioridade:</span>
                <span className={styles.spanDetalhes}>{chamado.nivel_prioridade}</span>
              </div>
              <div>
                <span>Atribuído a:</span>
                <span className={styles.spanDetalhes}>{chamado.atribuido_a}</span>
              </div>
            </div>


          </Card>
          <Card>

            <span>Histórico</span>

          </Card>
        </div>
      </div>


    </PaginaPadrao>

  )
}

export default Chamado
