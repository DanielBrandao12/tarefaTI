import React from 'react'
import styles from './style.module.css'
import stylesGlobal from '../../styles/styleGlobal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'

//provisorio
import { LoremIpsum } from 'lorem-ipsum';

function Chamado() {

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

  return (

    <PaginaPadrao >

      <div className={styles.containerDivCards}>
        <div className={styles.containerFirstCard}>
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
          <Card>
            <h3 className={styles.titleAssunto}>Lista de Tarefas</h3>
            <span>Adiconar novo item</span>
            <div className={stylesGlobal.containerInputAdd}>
              <input type='text' placeholder='Digite a tarefa' className={stylesGlobal.inputTextChamado} />
              <div className={stylesGlobal.containerIconPlus}>
                <FontAwesomeIcon icon={faPlus} className={stylesGlobal.positionIconPlus} />
              </div>
            </div>
            <label>Marque como concluída</label>
            <label>
              <input type="checkbox" value="opcao1" />Opção 1
            </label>
            <label>
              <input type="checkbox" value="opcao1" />Opção 2
            </label>
            <label>
              <input type="checkbox" value="opcao1" />Opção 3
            </label>
            <label>
              <input type="checkbox" value="opcao1" />Opção 4
            </label>


          </Card>


        </div>
        <div className={styles.containerSecondCard}>
          <Card>
            <h1>Service Desk 2.0ssssssssssss</h1>
            <span>teste</span>
          </Card>
        </div>
      </div>


    </PaginaPadrao>

  )
}

export default Chamado
