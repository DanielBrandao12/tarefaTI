import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import styles from "./style.module.css";
import styleGlobal from "../../styles/styleGlobal.module.css"
const Table = ({ data, columns, mensagensNaoLidas, fetchData, click }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortedData, setSortedData] = useState([...data]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (fetchData) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    setSortedData([...data]); // Atualiza os dados ordenados quando `data` muda
  }, [data]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  
    const sorted = [...sortedData].sort((a, b) => {
      const valueA = a[key] ?? ""; // Se for undefined, atribui uma string vazia
      const valueB = b[key] ?? ""; // Se for undefined, atribui uma string vazia
  
      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return direction === "asc" ? (valueA || 0) - (valueB || 0) : (valueB || 0) - (valueA || 0);
      }
    });
  
    setSortedData(sorted);
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div >
      <div className={styleGlobal.controls}>
        <label>Exibir</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <label>itens por página</label>
      </div>

      <table className={styleGlobal.table}>
        <thead className={styleGlobal.thead}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label} {getSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styleGlobal.tbody}>
          {currentData.map((row, index) => (
            <tr
              key={index}
              className={mensagensNaoLidas[row.id_ticket] ? styles.chamadoNaoLido : ""}
            >
              {columns.map((col) => (
                <td key={col.key} onClick={() => click(row)}>
                  {row[col.key] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styleGlobal.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Table;
