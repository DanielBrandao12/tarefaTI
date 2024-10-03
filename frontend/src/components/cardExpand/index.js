import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.css'

function CardExpand({ children }) {
//Children vai ser um array

  const [expandCard, setExpandCard] = useState(false)
  const toggle = () => {
    setExpandCard(!expandCard);
  };
  return (
    <div className={styles.containerCardExpand} onClick={toggle}>
      <div className={styles.containerDivFirst}>
        
        {children}
        <FontAwesomeIcon icon={expandCard ? faChevronUp : faChevronDown} style={{ color: '#b20000' }} />
      </div>
      {
        expandCard && <div className={styles.containerDivTwo}>
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
  )
}

export default CardExpand
