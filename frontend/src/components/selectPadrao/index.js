import React, { useState } from 'react';
import styles from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTicketSimple } from '@fortawesome/free-solid-svg-icons';

function SelectPadrao({ children }) {
    const [isOptions, setIsOptions] = useState(false);

    const toggle = () => {
        setIsOptions(!isOptions);
    };

    return (
        <div className={styles.containerSelect} onClick={toggle}>
            {children[0]}
            <FontAwesomeIcon className={styles.iconStatus} icon={isOptions ? faChevronUp : faChevronDown} />
            {isOptions && (
                <div className={styles.cardOptions}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{ children[0]=='Baixa' ?<FontAwesomeIcon icon={faTicketSimple} style={{color:'#38BC7D'}}/>:null} {children[0]}</span>
                        <span>{ children[1]=='Média' ?<FontAwesomeIcon icon={faTicketSimple} style={{color:'#FFC200'}}/>:null} {children[1]}</span>
                        <span>{ children[2]=='Alta' ?<FontAwesomeIcon icon={faTicketSimple} style={{color:'#E64342'}}/>:null} {children[2]}</span>
                        <span>{children[3]}</span>
                  
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectPadrao;
