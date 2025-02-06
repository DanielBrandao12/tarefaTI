const {Historico_status} = require('../database/models')

//criar um get para atualizar na tela os historico de status do ticket
//criar uma view do historico de status
const getHistorico = async (req, res) =>{
    const {id} = req.params

    try{

        const historico = await Historico_status.findAll({
            where: {
                id_ticket:id
            }
        })
        
        res.status(200).json(historico)
    }catch (error) {
        console.error('erro ao tentar encontrar historico:', error);
        res.status(500).json({ error: 'erro ao tentar encontrar historico' });
    }
}



module.exports = {
    getHistorico
}