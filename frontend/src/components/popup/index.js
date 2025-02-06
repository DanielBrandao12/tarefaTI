import React, { useEffect } from 'react';
import style from './style.module.css';

 const Popup = ({ openPopup, onClose, children, autoCloseTime }) => {
  useEffect(() => {
    if (openPopup && autoCloseTime) {
      const timer = setTimeout(onClose, autoCloseTime);
      return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente ou se o estado mudar
    }
  }, [openPopup, autoCloseTime, onClose]);

  if (!openPopup) return null; // Não renderiza o popup se não estiver aberto

  return (
    <div className={style.popupOverlay} onClick={onClose}>
      <div className={style.popupContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};


export default Popup