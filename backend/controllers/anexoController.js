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

const getAnexos = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Busca o anexo no banco de dados
      const anexo = await Anexo.findByPk(id);
  
      if (!anexo) {
        return res.status(404).json({ error: 'Anexo não encontrado' });
      }
  
      // Pegamos os dados do anexo
      const { arquivo, tipo, nome } = anexo;
  
      // Configura os cabeçalhos corretos para forçar o download
      res.setHeader('Content-Type', tipo);
      res.setHeader('Content-Disposition', `attachment; filename="${nome}"`);
      res.setHeader('Content-Length', arquivo.length);
  
      // Envia o arquivo diretamente, sem converter novamente
      res.send(arquivo);
    } catch (error) {
      console.error('Erro ao buscar anexo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
  
  
  
  
module.exports = { 
    getAnexoId,
    getAnexos
 };
