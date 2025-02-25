import {useState} from "react";

import api from "../services/api";

const useAnexo = () =>{
    const [anexos, setAnexos] = useState([])

    const fetchAnexos = async (id_ticket) => {
        try {
          const response = await api.get(`/anexo/${id_ticket}`);
          console.log(response);
          // Atualiza o estado com os dados dos anexos
          setAnexos(response.data); // Ajuste conforme a resposta esperada
        } catch (error) {
          console.error("Erro ao buscar anexos:", error);
        }
      };


      const downloadFile = async (id) => {
        try {
          // Faz a requisição para pegar o arquivo com responseType 'blob'
          const response = await api.get(`/anexo/getAnexo/${id}`, {
            responseType: "blob",
          });
    
          // Obtém o Content-Type do cabeçalho
          const contentType =
            response.headers["content-type"] || "application/octet-stream";
    
          // Define um nome de arquivo padrão
          let fileName = `arquivo`;
    
          // Tenta obter o nome do arquivo do cabeçalho Content-Disposition
          const contentDisposition = response.headers["content-disposition"];
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (fileNameMatch && fileNameMatch[1]) {
              fileName = fileNameMatch[1];
            }
          } else {
            // Se não houver Content-Disposition, tenta definir a extensão pelo Content-Type
            const mimeTypes = {
              "application/pdf": "pdf",
              "image/png": "png",
              "image/jpeg": "jpg",
              "image/jpg": "jpg",
              "image/webp": "webp",  // Adicionado suporte para WebP
              "application/zip": "zip",
              "application/msword": "doc",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                "docx",
              "application/vnd.ms-excel": "xls",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                "xlsx",
            };
    
            if (mimeTypes[contentType]) {
              fileName += `.${mimeTypes[contentType]}`;
            }
          }
    
          // Cria um Blob a partir dos dados binários
          const fileBlob = new Blob([response.data], { type: contentType });
    
          // Cria uma URL para o arquivo
          const fileUrl = window.URL.createObjectURL(fileBlob);
    
          // Cria um elemento de link para o download
          const link = document.createElement("a");
          link.href = fileUrl;
          link.setAttribute("download", fileName);
    
          // Simula um clique para iniciar o download
          document.body.appendChild(link);
          link.click();
    
          // Remove o link após o download
          document.body.removeChild(link);
          window.URL.revokeObjectURL(fileUrl); // Libera a URL do objeto para evitar vazamento de memória
        } catch (error) {
          console.error("Erro ao baixar o anexo", error);
        }
      };


      return {
        anexos,
        fetchAnexos,
        downloadFile,
      }
}

export default useAnexo;