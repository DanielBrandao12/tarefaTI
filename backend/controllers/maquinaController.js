
const {Maquina}  = require('../database/models');



const consultaMaquina = async (req, res) => {
    try {
        // Consulta todas as máquinas no banco de dados
        const response = await Maquina.findAll();

        // Retorna a lista de máquinas em formato JSON
        res.status(200).json(response);
    } catch (error) {
        console.error('Erro ao consultar as máquinas:', error);
        res.status(500).json({ error: 'Erro ao consultar as máquinas' });
    }
};

module.exports = { consultaMaquina };