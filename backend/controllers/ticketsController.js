const { Tickets, ListaTarefa } = require('../database/models');


// Função que gera um código de ticket com a data e um número aleatório
const gerarCodigoTicket = () => {
    const dataAtual = new Date();
    
    // Formatar a data como ddMMyyyy
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${ano}${mes}${dia}`;

    // Gerar um número aleatório de 3 dígitos
    const numeroAleatorio = Math.floor(100 + Math.random() * 900); // Entre 100 e 999

    // Concatenar a data formatada com o número aleatório
    const codigoTicket = `${dataFormatada}${numeroAleatorio}`;

    return codigoTicket;
}

// Função para verificar se o código de ticket já existe no banco de dados
const verificarCodigoUnico = async (codigoTicket) => {
    const ticketExistente = await Tickets.findOne({
        where: { codigo_ticket: codigoTicket }
    });
    return ticketExistente !== null;
}

// Função para criar o ticket com código único
const createTickets = async (req, res) => {
    try {
        let codigo_ticket;

        // Gera um código até encontrar um que não existe no banco de dados
        do {
            codigo_ticket = gerarCodigoTicket();
        } while (await verificarCodigoUnico(codigo_ticket));

        const {
            id_categoria,
            nome_requisitante,
            assunto,
            descricao,
            nivel_prioridade,
            lista_tarefa, // Supondo que isso seja uma string
            id_status,
            atribuido_a,
            id_usuario
        } = req.body;

        

        const ticketCriado = await Tickets.create({
            codigo_ticket,
            assunto,
            nome_requisitante,
            descricao,
            nivel_prioridade,
            data_criacao: new Date(),
            atribuido_a,
            id_categoria,
            id_usuario,
            id_status
        });

        //If para só criar uma lista se existir uma
        if(lista_tarefa){

            // Verifica se lista_tarefa é uma string e tenta converter para um array
            let tarefasArray = Array.isArray(lista_tarefa) ? lista_tarefa : JSON.parse(lista_tarefa);
           
            // Criação das tarefas
           await tarefasArray.forEach((item) => {
                ListaTarefa.create({
                    assunto: item,
                    status_tarefa: 'Não concluída',
                    id_ticket: ticketCriado.id_ticket
                });
            });
        }

        return res.status(201).json({
            message: 'Ticket criado com sucesso!',
            ticketCriado
        });

    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao criar ticket: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao criar ticket, tente novamente mais tarde.",
        });
    }
}


//Função para editar ticket um ou mais de um campo
const updateTicket = async (req, res) => {
    try {
        const {
            id_ticket,
            id_categoria,
            nome_requisitante,
            assunto,
            descricao,
            nivel_prioridade,
            id_status,
            atribuido_a,
        } = req.body;

        // Validação básica (você pode usar uma biblioteca para isso)
        if (!id_ticket) {
            return res.status(400).json({ message: "O ID do ticket é obrigatório." });
        }

        // Verificar se o ticket existe
        const ticketExistente = await Tickets.findOne({ where: { id_ticket } });
        if (!ticketExistente) {
            return res.status(404).json({ message: "Ticket não encontrado." });
        }

        // Atualizar o ticket
        const ticketAlterado = await Tickets.update({
            assunto,
            nome_requisitante,
            descricao,
            nivel_prioridade,
            atribuido_a,
            id_categoria,
            id_status
        }, {
            where: { id_ticket }
        });

        return res.status(200).json({
            message: 'Ticket alterado com sucesso!',
            ticketAlterado
        });

    } catch (error) {
        console.error("Erro em alterar ticket: ", error);
        return res.status(500).json({
            message: error.message || "Erro em alterar ticket, tente novamente mais tarde.",
        });
    }
};


module.exports = {
    createTickets,
    updateTicket
}