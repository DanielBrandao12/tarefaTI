import React, { useState } from 'react';
import styles from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Card from '../card';

function ExpandirLista({children, title}) {
    const [isOptions, setIsOptions] = useState(false);

    const toggle = () => {
        setIsOptions(!isOptions);
    };
    
  return (
    <Card>
        <div onClick={toggle} className={styles.containerTitleExpand}>
            <span>{title}</span>
            <FontAwesomeIcon style={{fontSize:'22px', color:'#b20000'}} icon={isOptions ? faChevronUp : faChevronDown} />
        </div>
        {
            isOptions && 
            <div>
            {children}

       </div>
        }
       
    </Card>
  )
}

export default ExpandirLista
