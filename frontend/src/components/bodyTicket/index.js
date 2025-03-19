import React from "react";

import styles from "./style.module.css"
import stylesGlobal from "../../styles/styleGlobal.module.css"

const BodyTicket = ({chamado, anexos, downloadFile}) =>{

    

    return (
        <div className={styles.containerChamadoView}>
        <h3 className={styles.titleAssunto}>{chamado.assunto}</h3>
        <div className={styles.autor}>
          <span className={styles.span}>Enviado por:</span>
          <p className={stylesGlobal.paragrafoGlobal}>
            {chamado.nome_requisitante}
          </p>
        </div>
        <div className={styles.autor}>
          <span className={styles.span}>Email:</span>
          <p className={stylesGlobal.paragrafoGlobal}>{chamado.email}</p>
        </div>

        <span className={styles.span}>Descrição:</span>
        <div className={styles.descri}>
          <p className={stylesGlobal.paragrafoGlobal}>
            <p
              style={{ marginLeft: "15px" }}
              dangerouslySetInnerHTML={{ __html: chamado.descricao }}
            />
          </p>
          <div className={stylesGlobal.anexosContainer}>
            <h3>Anexos:</h3>
            {anexos && anexos.length > 0 ? (
              <ul>
                {anexos.map((anexo) => (
                  <li key={anexo.id}>
                    <span>{anexo.nome}</span>
                    <button onClick={() => downloadFile(anexo.id)}>
                      Baixar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum anexo encontrado.</p>
            )}
          </div>
        </div>
      </div>
    )
}


export default BodyTicket;