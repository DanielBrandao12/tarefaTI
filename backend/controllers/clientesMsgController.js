
const {Clientes} = require('../database/models')



const createMsg = async (req, res) => {
    try {
        const {nome_completo, email, assunto, mensagem} = req.body;

        if(!nome_completo || !email || !assunto || mensagem) {
            return res.status(400).json({error : "Campos obrigatórios não fornecidos"});
        }

        const novaMensagem = await Clientes.create({
            nome_completo,
            email,
            assunto,
            mensagem,
            data_hora:  new Date(),
        })

        res.status(201).json(novaMensagem)
    }catch (error){
        console.error('Erro ao tentar enviar mensagem:', error);
        res.status(500).json({ error: 'Erro ao tentar enviar mensagem' });
    }
}

const addIdTicket = async (req, res) =>{
    try {
        
        const {id_cliente, id_ticket} = req.body

        const mensagemAlterada = await Clientes.update(
            {
                id_ticket
            },
            {
                where: {id_cliente}
            }
        )
        // Retorna uma mensagem de sucesso
    res.status(200).json({ mensagemAlterada, message: 'Alteração feita com sucesso' });
    }catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar' });
    }
}


module.exports = {
    createMsg,
    addIdTicket
}