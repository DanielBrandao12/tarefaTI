const { RelatorioSoftware, Software  } = require('../database/models');

const { Op } = require('sequelize');



const AddItem = async (req, res) => {
    try {
        const maquinas = req.body; // Recebe o array de máquinas com seus softwares
            console.log(maquinas)
        // Prepara os itens para inserção em lote
        const itensParaAdicionar = [];

        maquinas.forEach(maquina => {
            maquina.id_softwares.forEach(softwareId => {
                itensParaAdicionar.push({
                    id_maquina: maquina.id_maquina,
                    id_software: softwareId
                });
            });
        });

        // Insere todos os registros de uma só vez
        await RelatorioSoftware.bulkCreate(itensParaAdicionar);

        res.status(201).json({ message: 'Item(s) adicionado(s) com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar item(s).' });
    }
};



const consultaSoftwares = async (req, res) => {
    try {
        const softwares = req.body; // Recebe o array de softwares do frontend

        // Extrai os nomes dos softwares para consulta
        const nomesSoftwares = softwares.map(software => software.name);

        console.log(nomesSoftwares); // Para verificar os nomes recebidos

        // Consulta todos os softwares que estão na lista de nomes recebida
        const resultados = await Software.findAll({
            where: {
                nome: {
                    [Op.in]: nomesSoftwares // Usa Op.in para buscar todos os nomes no array
                }
            },
            attributes: ['id', 'nome'] // Retorna apenas os campos "id" e "nome"
        });

        // Mapeia os resultados para um array de objetos com id e nome
        const idsEncontrados = resultados.map(software => ({
            id: software.id,
            nome: software.nome
        }));

        res.status(200).json(idsEncontrados); // Retorna os IDs encontrados
    } catch (error) {
        console.error('Erro ao consultar os softwares:', error);
        res.status(500).json({ error: 'Erro ao consultar os softwares' });
    }
};

module.exports = {
    AddItem,
    consultaSoftwares
}