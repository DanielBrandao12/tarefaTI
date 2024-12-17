const {Respostas} = require('../database/models')

const getResposta = async (req, res) => {
    try {
        const {id_ticket} = req.body

        const respostasTicket = await Respostas.findAll({
            where: {
                id_ticket
            }
        })

        res.status(200).json(respostasTicket)

    } catch(error){
        console.error("Não encontrado: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Não encontrado, tente novamente mais tarde.",
        });
    }
}


const createResposta = async (req, res) => {
    try {
        const {id_ticket, id_usuario, resposta} = req.body

        const respostaCriada =  await Respostas.create({
            data_hora: new Date(),
            conteudo:resposta,
            id_usuario,
            id_ticket
        })


        return res.status(201).json({
            message: 'Resposta criada com sucesso!',
            respostaCriada
        });

    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao criar resposta: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao criar resposta, tente novamente mais tarde.",
        });
    }
}



module.exports = {
    createResposta,
    getResposta,
 
}
//o usuario que vai ter acesso ao ticket usando o codigo, vai poder enviar respostas tambem 
//mas ai o id do usuario vai ser um padrão para o usuario 