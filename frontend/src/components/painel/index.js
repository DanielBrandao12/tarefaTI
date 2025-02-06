import React from 'react'

import styles from './style.module.css'

function Painel({children}) {
  return (
    <div className={styles.Painel}>
      {children}
    </div>
  )
}

export default Painel
