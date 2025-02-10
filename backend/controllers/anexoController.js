const { Anexo } = require('../database/models');
const { Op } = require('sequelize'); // Lembre-se de importar Op para utilizar o operador 'Op.or'

const getAnexoId = async (req, res) => {
    const { id } = req.params;  // Recebe o parâmetro "id" da URL

    try {
        // Buscar anexos com o "ticket_id" ou "resposta_id" igual ao "id"
        const anexos = await Anexo.findAll({
            where: {
                [Op.or]: [
                    { ticket_id: id },
                    { resposta_id: id }
                ]
            }
        });

        // Verifica se foram encontrados anexos
        if (anexos.length === 0) {
            return res.status(404).json({ message: 'Anexos não encontrados.' });
        }

        // Retorna os anexos encontrados
        return res.status(200).json(anexos);
        
    } catch (error) {
        // Em caso de erro, retorna o erro com status 500
        return res.status(500).json({ message: 'Erro ao buscar anexos.', error: error.message });
    }
};

module.exports = { getAnexoId };
