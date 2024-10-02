import React, { useState } from 'react'
import styles from './style.module.css'
import stylesGlobal from '../../styles/styleGlobal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faPrint,faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'
import SelectPadrao from '../../components/selectPadrao';
//provisorio
import { LoremIpsum } from 'lorem-ipsum';

function Chamado() {
  const array = ['Aguardando Classficação','Em atendimento','Suspenso','Fechado']
  const array1 = ['Hardware','Software','Acedemico','Rede']
  const array2 = ['Baixa','Média','Alta']
  const array3 = ['Daniel','Márcio','Clayton','Wilson']
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      min: 3,
      max: 7,
    },
    wordsPerSentence: {
      min: 5,
      max: 15,
    },
  });

  const [expandCard, setExpandCard] = useState(false)
  const toggle = () => {
    setExpandCard(!expandCard);
};

  return (

    <PaginaPadrao >

      <div className={styles.containerDivCards}>
        <div className={styles.containerFirstCard}>
          {/*Assunto principal do chamado */}
          <Card>
            <div className={styles.containerChamadoView}>

              <h3 className={styles.titleAssunto}>Instalação de softwares INTERFATECS</h3>
              <div className={styles.autor}>
                <span className={styles.span}>Criado por:</span>
                <p className={stylesGlobal.paragrafoGlobal}>Daniel</p>
              </div>
              <p className={stylesGlobal.paragrafoGlobal}>{lorem.generateParagraphs(1)}</p>
              <p className={stylesGlobal.paragrafoGlobal}>{lorem.generateParagraphs(1)}</p>
            </div>


          </Card>
          {/*Card de lista de tarefas */}
          <Card>

            <div className={styles.containerListaTarefas}>

              <h3 className={styles.titleLista}>Lista de Tarefas</h3>
              <div className={styles.addContainer}>

                <span>Adiconar novo item</span>

                <div className={stylesGlobal.containerInputAdd}>
                  <input type='text' placeholder='Digite a tarefa' className={stylesGlobal.inputTextChamado} />
                  <div className={stylesGlobal.containerIconPlus}>
                    <FontAwesomeIcon icon={faPlus} className={stylesGlobal.positionIconPlus} />
                  </div>
                </div>
              </div>


              <div className={styles.containerCheckboxes}>


                <label>
                  <input type="checkbox" value="opcao1" className={styles.checkBox} />Opção 1
                </label>
                <label>
                  <input type="checkbox" value="opcao1" className={styles.checkBox} />Opção 2
                </label>
                <label>
                  <input type="checkbox" value="opcao1" className={styles.checkBox} />Opção 3
                </label>
                <label>
                  <input type="checkbox" value="opcao1" className={styles.checkBox} />Opção 4
                </label>

              </div>

            </div>


          </Card>

          <Card>

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
            <div className={styles.statusContainer}>
              <div>
                <span>Status:</span>
                <SelectPadrao>{array}</SelectPadrao>
              </div>
              <div>
                <span>Categoria:</span>
                <SelectPadrao>{array1}</SelectPadrao>
              </div>
              <div>
                <span>Prioridade:</span>
                <SelectPadrao>{array2}</SelectPadrao>
              </div>
              <div>
                <span>Atribuído a:</span>
                <SelectPadrao>{array3}</SelectPadrao>
              </div>
            </div>
          </Card>
          <Card>
            <div onClick={toggle}>
              <span>Detalhes do chamado</span>
              <FontAwesomeIcon  icon={expandCard ? faChevronUp : faChevronDown} style={{color: '#b20000'}}/>
                  {
                    expandCard && <div style={{display:'flex', flexDirection:'column'}}>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      <span>Detalhes do chamado</span>
                      </div>
                  }
            </div>
          </Card>
          <Card>
            <div>
              <span>Histórico</span>
            </div>
          </Card>
        </div>
      </div>


    </PaginaPadrao>

  )
}

export default Chamado
