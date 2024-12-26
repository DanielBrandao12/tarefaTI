
const { Tickets, ListaTarefa, Historico_status, View_Ticket, View_Respostas } = require('../database/models');


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

        //quando o post vier da pagina do usuário  de criação de ticket a categoria vai ser 
        // aguardando aprovação id da categoria!
        const {
            idCategoria,
            nomeReq,
            assunto,
            emailReq,
            descri,
            prioridade,
            listaTarefa,
            idStatus,
            atribuir,
            id_usuario
        } = req.body;

        

        const ticketCriado = await Tickets.create({
            codigo_ticket,
            assunto,
            email:emailReq,
            nome_requisitante:nomeReq,
            descricao:descri,
            nivel_prioridade:prioridade,
            data_criacao: new Date(),
            atribuido_a:atribuir,
            id_categoria:idCategoria,
            id_usuario,
            id_status:idStatus
        });

        //If para só criar uma lista se existir uma
        if(listaTarefa){

            // Verifica se lista_tarefa é uma string e tenta converter para um array
            let tarefasArray = Array.isArray(listaTarefa) ? listaTarefa : JSON.parse(listaTarefa);
           
            // Criação das tarefas
           await tarefasArray.forEach((item) => {
                ListaTarefa.create({
                    assunto: item,
                    status_tarefa: 'Não concluída',
                    id_ticket: ticketCriado.id_ticket
                });
            });
        }

        //cria um historico sempre que o status for alterado
        //Para controle do andamento do atendimento
        createHistorico( ticketCriado.id_ticket, idStatus, id_usuario)

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
            email,
            assunto,
            descricao,
            nivel_prioridade,
            id_status,
            atribuido_a,
            id_usuario
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
            email,
            nome_requisitante,
            descricao,
            nivel_prioridade,
            atribuido_a,
            id_categoria,
            id_status
        }, {
            where: { id_ticket }
        });

        if(id_status) {

            createHistorico( id_ticket, id_status, id_usuario)
        }

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


const getTickets = async (req, res) =>{
 

    try{
        const tickets = await View_Ticket.findAll()

        console.log(tickets)
        return res.status(201).json(tickets);

    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao buscar tickets ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao buscar tickets, tente novamente mais tarde.",
        });
    }
}

// Função para obter ticket por ID
const getTicketsId = async (req, res) => {
    const { id } = req.params;
    

    const id_ticket = id
    try {
        // Busca o ticket pelo ID primário
        const ticket = await Tickets.findByPk(id_ticket);

        // Verifica se o ticket existe
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket não encontrado.",
            });
        }

        // Busca respostas relacionadas ao ticket
        const respostas = await getViewRespostaId(id);

        // Retorna o ticket e as respostas relacionadas
        return res.status(200).json({
            ticket,
            respostas,
        });
    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao buscar ticket:", error);

        // Resposta de erro
        return res.status(500).json({
            message: "Erro ao buscar ticket. Tente novamente mais tarde.",
            
        });
    }
};

// Função para obter respostas relacionadas ao ticket
const getViewRespostaId = async (id_ticket) => {
    try {
        // Busca todas as respostas relacionadas ao ID do ticket
        const respostas = await View_Respostas.findAll({
            where: { id_ticket },
        });

        return respostas;
    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao buscar respostas:", error);

        // Lança o erro para que a função chamadora trate
        return res.status(500).json({
            message: "Erro ao buscar respostas. Tente novamente mais tarde.",
           
        });
    }
};

const getListaTarefaTicket = async (req, res) =>{
    
    const {id} = req.params
    console.log(id)

try{
    const listaTarefa = await ListaTarefa.findAll(
        {
            where:{
                id_ticket:id
            }
        })

    console.log(listaTarefa)
    return res.status(201).json(listaTarefa);

} catch (error) {
    // Log de erro para depuração
    console.error("Erro ao buscar Lista de tarefas", error);

    // Resposta de erro
    return res.status(500).json({
        message: error.message || "Erro ao buscar lista, tente novamente mais tarde.",
    });
}
}


//função para criar um historico de status sempre que for criado um ticket ou se os status for alterado
const createHistorico = async ( id_ticket, id_status, id_usuario) =>{
    await Historico_status.create({
        data_hora: new Date(),
        id_ticket,
        id_status,
        id_usuario
    })
}



module.exports = {
    createTickets,
    updateTicket,
    getTickets,
    getTicketsId,
    getListaTarefaTicket,
   
}
