const { RelatorioSoftware, Software  } = require('../database/models');

const { Op } = require('sequelize');



const AddItem = async (req, res) => {
    try {
        const maquinas = req.body; // Recebe o array de máquinas com seus softwares
        console.log(maquinas.items);

        // Prepara os itens para inserção em lote
        const itensParaAdicionar = [];

        maquinas.items.forEach(maquina => {
            // Adiciona uma única entrada para cada máquina, incluindo todos os softwares em um array
            itensParaAdicionar.push({
                id_maquina: maquina.id_maquina,
                id_softwares: maquina.id_softwares // Aqui, armazena o array de softwares diretamente
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
        const { id, programas } = req.body;

        const id_maquina = id
        const softwares = programas

        console.log(id_maquina, softwares)
        // Extrai os nomes dos softwares para consulta
        const nomesSoftwares = softwares.map(software => software.name);

        //console.log(`Consultando softwares para a máquina ${id_maquina}...`);
        //console.log('Nomes de softwares:', nomesSoftwares);

        // Consulta todos os softwares que estão na lista de nomes recebida
        const resultados = await Software.findAll({
            where: {
                nome: {
                    [Op.in]: nomesSoftwares // Usa Op.in para buscar todos os nomes no array
                }
            },
            attributes: ['id'] // Retorna apenas o campo "id"
        });

        // Extrai apenas os IDs dos resultados
        const idsEncontrados = resultados.map(software => software.id);

        // Verifica se algum ID foi encontrado, caso contrário, retorna uma mensagem informativa
        if (idsEncontrados.length === 0) {
            return res.status(404).json({ error: 'Nenhum software correspondente encontrado' });
        }

        // Formata o resultado como um array de objeto com id_maquina e id_softwares
        const resultadoFormatado = [
            {
                id_maquina,
                id_softwares: idsEncontrados
            }
        ];

        // Retorna o array de objetos com o formato desejado
        res.status(200).json(resultadoFormatado);
    } catch (error) {
        console.error('Erro ao consultar os softwares:', error);
        res.status(500).json({ error: 'Erro ao consultar os softwares' });
    }
};




module.exports = {
    AddItem,
    consultaSoftwares
}