const { Tickets } = require('../database/models');


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
            lista_tarefa,
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
            lista_tarefa,
            id_categoria,
            id_usuario,
            id_status
        });

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
    
}

module.exports = {
    createTickets
}
