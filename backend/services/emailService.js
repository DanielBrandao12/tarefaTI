const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const { imapConfig } = require('../config/imapConfig');
const transporter = require('../config/nodemailerConfig');
const { Tickets, Historico_status, Respostas } = require('../database/models');

async function checkEmails() {
    try {
        console.log('Iniciando a conexão IMAP...');
        const connection = await Imap.connect(imapConfig);
        console.log('Conexão estabelecida com sucesso!');

        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN']; // Buscar apenas e-mails não lidos
        const fetchOptions = { bodies: [''], struct: true };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Encontrados ${messages.length} e-mails não lidos.`);

        if (messages.length === 0) {
            console.log('Nenhum e-mail novo para processar.');
            return;
        }

        for (const message of messages) {
          const all = message.parts.find(part => part.which === '');
          if (!all) {
              console.error('Não foi possível encontrar o corpo do e-mail.');
              continue;
          }
      
          const parsed = await simpleParser(all.body);
          console.log(`Processando e-mail de: ${parsed.from?.text || 'Desconhecido'}`);
      
          const chamado = {
              remetente: parsed.from?.text || 'Desconhecido',
              assunto: parsed.subject || 'Sem assunto',
              mensagem: parsed.text || 'Sem conteúdo no corpo do e-mail',
          };
      
          const { nome, email } = parseRemetente(chamado.remetente);
      
          // Tentar extrair o código do ticket do assunto do e-mail
          const codigoTicket = extrairCodigoTicket(chamado.assunto);
          console.log(chamado.assunto)
          try {
            
              if (codigoTicket) {
                  // Verificar se o ticket já existe no banco de dados
                  const ticketExistente = await getTicketPorCodigo(codigoTicket);
                  console.log(ticketExistente)
                  if (ticketExistente) {
                      console.log(`O ticket ${codigoTicket} já existe. Não será criado um novo chamado.`);
                     // await enviarRespostaAutomatica(chamado.remetente, codigoTicket);
                      //aqui ele vai pegar a mensagem recebida e guarda na tabela de respostas
                    await  createResposta(
                        ticketExistente.dataValues.id_ticket,
                        ticketExistente.dataValues.descricao
                      )
                   
                      // Marca o e-mail como lido
                      await connection.addFlags(message.attributes.uid, ['\\Seen']);
                      continue; // Não prossegue para criação
                  }
              }
      
              // Criar novo chamado se não houver código válido no assunto
              const ticketCriado = await criarChamadoPorEmail(chamado);
              console.log(`Chamado criado com sucesso para: ${chamado.remetente} (Ticket: ${ticketCriado.ticketCriado.codigo_ticket})`);

              
      
              // Enviar resposta automática com o código do ticket criado
              await enviarRespostaAutomatica(chamado.remetente, ticketCriado.ticketCriado.codigo_ticket);
              //essa resposta colocar tambem na tabela
              // Marca o e-mail como lido após processamento
              await connection.addFlags(message.attributes.uid, ['\\Seen']);
          } catch (error) {
              console.error(`Erro ao processar o e-mail de ${chamado.remetente}:`, error);
              continue;
          }
      }
      
        await connection.end();
        console.log('Conexão IMAP encerrada com sucesso!');
    } catch (error) {
        console.error('Erro ao verificar e-mails:', error);
    }
}

const createResposta = async (id_ticket, descricao) => {
  try {
      

      const respostaCriada =  await Respostas.create({
          data_hora: new Date(),
          conteudo:descricao,
          id_usuario:null,
          id_ticket
      })


   

  } catch (error) {
      // Log de erro para depuração
      console.error("Erro ao criar resposta: ", error);

  }
}


// Função para extrair o código do ticket do assunto do e-mail
const extrairCodigoTicket = (assunto) => {
    const regex = /RE: Chamado Recebido - (\d{11})/;  // Expressão regular para extrair o código do ticket
    const match = assunto.match(regex);
    return match ? match[1] : null;  // Retorna o código se encontrado, caso contrário retorna null
};

const parseRemetente = (remetente) => {
    const regex = /^(.*?)(?:\s<(.+?)>)?$/;
    const match = remetente.match(regex);

    if (match) {
        return {
            nome: match[1].replace(/"/g, '').trim(),
            email: match[2] || '',
        };
    }

    return { nome: '', email: '' };
};

const criarChamadoPorEmail = async (emailData) => {
    try {
        const { remetente, assunto, mensagem } = emailData;
        const { nome, email } = parseRemetente(remetente);

        let codigo_ticket;
        do {
            codigo_ticket = gerarCodigoTicket();
            console.log(codigo_ticket)
        } while (await verificarCodigoUnico(codigo_ticket));

        const ticketData = {
            idCategoria: null,
            nomeReq: nome,
            assunto: assunto || "Sem assunto",
            emailReq: email,
            descri: mensagem || "Sem conteúdo no corpo do e-mail",
            prioridade: "",
            idStatus: 1,
            atribuir: null,
            id_usuario: null
        };

        const ticketCriado = await Tickets.create({
            codigo_ticket,
            assunto: ticketData.assunto,
            email: ticketData.emailReq,
            nome_requisitante: ticketData.nomeReq,
            descricao: ticketData.descri,
            nivel_prioridade: ticketData.prioridade,
            data_criacao: new Date(),
            atribuido_a: ticketData.atribuir,
            id_categoria: ticketData.idCategoria,
            id_usuario: ticketData.id_usuario,
            id_status: ticketData.idStatus
        });

        createHistorico(ticketCriado.id_ticket, ticketData.idStatus, ticketData.id_usuario);

        return {
            message: 'Chamado criado com sucesso!',
            ticketCriado
        };
    } catch (error) {
        console.error("Erro ao criar chamado: ", error);
        return {
            message: error.message || "Erro ao criar chamado, tente novamente mais tarde."
        };
    }
};

const getTicketPorCodigo = async (codigoTicket) => {
    if (!codigoTicket) return null;
    return await Tickets.findOne({ where: { codigo_ticket: codigoTicket } });
};

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

    return codigoTicket
};

const verificarCodigoUnico = async (codigo) => {
    const ticket = await Tickets.findOne({ where: { codigo_ticket: codigo } });
    return !!ticket;
};

const enviarRespostaAutomatica = async (remetente, codigoTicket) => {
    try {
        await transporter.sendMail({
            from: 'servicedesk@fatecbpaulista.edu.br',
            to: remetente,
            subject: `Chamado Recebido - ${codigoTicket}`,
            text: `Obrigado por entrar em contato. Seu chamado foi registrado com o código: ${codigoTicket}`,
        });
        console.log(`Resposta automática enviada para: ${remetente}`);
    } catch (mailError) {
        console.error(`Erro ao enviar resposta automática para ${remetente}:`, mailError);
    }
};

// Função para criar um histórico de status
const createHistorico = async (id_ticket, id_status, id_usuario) => {
    await Historico_status.create({
        data_hora: new Date(),
        id_ticket,
        id_status,
        id_usuario
    });
};


module.exports = { checkEmails };
