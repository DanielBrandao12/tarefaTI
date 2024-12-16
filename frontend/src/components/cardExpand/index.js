import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.css'

function CardExpand({ children, title }) {
//Children vai ser um array

  const [expandCard, setExpandCard] = useState(false)
  const toggle = () => {
    setExpandCard(!expandCard);
  };
  return (
    <div className={styles.containerCardExpand} onClick={toggle}>
      <div className={styles.containerDivFirst}>
          <span className={styles.titleCardExpand}>{title}</span>
        
        <FontAwesomeIcon icon={expandCard ? faChevronUp : faChevronDown} style={{ color: '#b20000' }} />
      </div>
      {
        expandCard && <div className={styles.containerDivTwo}>
        {children}
        </div>
      }
    </div>
  )
}

export default CardExpand
