import React from 'react'

import styles from './style.module.css'

function Card({children}) {
  return (
    <div className={styles.containerCard}>
      {children}
    </div>
  )
}

export default Card
