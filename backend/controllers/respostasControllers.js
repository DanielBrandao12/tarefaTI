const {Respostas} = require('../database/models')
const transporter = require('../config/nodemailerConfig');


const getRespostasNaoLidas = async (req, res) => {
    try {
        const respostasNaoLidas = await Respostas.findAll({
            where: {
                lida: false, // Busca respostas com "lida" igual a false
            }
        });

        res.status(200).json(respostasNaoLidas);

    } catch (error) {
        console.error("Erro ao buscar respostas não lidas: ", error);

        return res.status(500).json({
            message: error.message || "Erro ao buscar respostas não lidas, tente novamente mais tarde.",
        });
    }
}


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
        const {id_ticket, id_usuario, resposta, codigoTicket, remetente} = req.body

        const respostaCriada =  await Respostas.create({
            data_hora: new Date(),
            conteudo:resposta,
            id_usuario,
            id_ticket,
            lida: true
        })

        enviarRespostaAutomatica(remetente, codigoTicket, resposta )

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


const marcarComoLida = async (req, res) => {
    try {
        const { ids } = req.body; // Recebe um array de IDs no body

        // Verifica se o array foi enviado e não está vazio
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "IDs das respostas são obrigatórios." });
        }

        // Atualiza todas as respostas para 'lida: true'
        const linhasAtualizadas = await Respostas.update(
            { lida: true },
            {
                where: { id_resposta: ids } // Atualiza todas que estiverem na lista
            }
        );

        // Verifica se alguma linha foi afetada
        if (linhasAtualizadas[0] === 0) {
            return res.status(404).json({ message: "Nenhuma resposta encontrada para atualizar." });
        }

        return res.status(200).json({ message: "Respostas marcadas como lidas com sucesso!" });
    } catch (error) {
        console.error("Erro ao marcar como lida: ", error);
        return res.status(500).json({
            message: error.message || "Erro ao marcar como lida, tente novamente mais tarde.",
        });
    }
};


const enviarRespostaAutomatica = async (remetente, codigoTicket, mensagem) => {
    try {
        console.log(mensagem)
        await transporter.sendMail({
            from: 'servicedesk2@fatecbpaulista.edu.br',
            to: remetente,
            subject: `Atualização do chamado - ${codigoTicket}`,
            html: mensagem

        });
        console.log(`Resposta automática enviada para: ${remetente}`);
    } catch (mailError) {
        console.error(`Erro ao enviar resposta automática para ${remetente}:`, mailError);
    }
};
module.exports = {
    createResposta,
    getResposta,
    getRespostasNaoLidas,
    marcarComoLida

}
//o usuario que vai ter acesso ao ticket usando o codigo, vai poder enviar respostas tambem 
//mas ai o id do usuario vai ser um padrão para o usuario 