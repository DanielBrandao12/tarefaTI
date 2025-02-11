const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const { imapConfig } = require('../config/imapConfig');
const transporter = require('../config/nodemailerConfig');
const { Tickets, Historico_status, Respostas, Anexo } = require('../database/models');
const cheerio = require('cheerio');

const checkEmails = async () => {
    let connection; // Inicializa a variável fora do try
    try {
        console.log('Iniciando a conexão IMAP...');
        connection = await Imap.connect(imapConfig);
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
            try {
                const all = message.parts.find(part => part.which === '');
                if (!all) {
                    console.error('Não foi possível encontrar o corpo do e-mail.');
                    continue;
                }

                const parsed = await simpleParser(all.body);
                console.log(`Processando e-mail de: ${parsed.from?.text || 'Desconhecido'}`);

                // Processa anexos
                const anexos = parsed.attachments.map(att => ({
                    nome: att.filename,
                    tipo: att.contentType,
                    tamanho: att.size,
                    arquivo: att.content // Não converta para base64 aqui
                  }));

                console.log(anexos.tamanho)
                const chamado = {
                    remetente: parsed.from?.text || 'Desconhecido',
                    assunto: parsed.subject || 'Sem assunto',
                    mensagem: parsed.html || 'Sem mensagem',
                    anexos: anexos || 'Sem anexo'
                };

                //console.log(chamado.mensagem);
                
                const codigoTicket = extrairCodigoTicket(chamado.assunto);

                if (codigoTicket) {
                    const ticketExistente = await getTicketPorCodigo(codigoTicket);

                    if (ticketExistente) {
                        console.log(`O ticket ${codigoTicket} já existe. Não será criado um novo chamado.`);
                        console.log(chamado.mensagem)
                        const mensagem = getDivFirst(chamado.mensagem);
                        await createResposta(ticketExistente.dataValues.id_ticket, mensagem, chamado.anexos);
                        //Quando vem com assinatura e caracteres eles traz os corpo de email todo
                        //tratar para pegar apenas o texto da resposta
                        await connection.addFlags(message.attributes.uid, ['\\Seen']);
                        continue;
                    }
                }

                const ticketCriado = await criarChamadoPorEmail(chamado);
                console.log(`Chamado criado com sucesso para: ${chamado.remetente} (Ticket: ${ticketCriado.ticketCriado.codigo_ticket})`);
                await enviarRespostaAutomatica(chamado.remetente, ticketCriado.ticketCriado.codigo_ticket);
                await connection.addFlags(message.attributes.uid, ['\\Seen']);
            } catch (error) {
                console.error(`Erro ao processar o e-mail:`, error);
            }
        }
    } catch (error) {
        console.error('Erro ao verificar e-mails:', error);
    } finally {
        if (connection) {
            await connection.end(); // Garante que a conexão será encerrada
            console.log('Conexão IMAP encerrada com sucesso!');
        }
    }
};


const getDivFirst = (mensagem) =>{
    const $ = cheerio.load(mensagem);

    // Remove os elementos que correspondem à citação do e-mail anterior
    $('blockquote, div.gmail_quote, .gmail_attr, #divRplyFwdMsg, .BodyFragment').remove();

     // Seleciona o conteúdo dentro das divs que estão antes das citações
     const resposta = $('body').children().filter(function() {
        return $(this).text().trim().length > 0; // Filtra elementos com texto significativo
    }).map(function() {
        return $(this).html(); // Pega o HTML de cada um desses elementos
    }).get().join(''); // Junta todos os conteúdos em uma string

    // Retorna o conteúdo limpo
    return resposta.trim();
}

const createResposta = async (id_ticket, descricao, anexo) => {
  try {
      

      const respostaCriada =  await Respostas.create({
          data_hora: new Date(),
          conteudo:descricao,
          id_usuario:null,
          id_ticket
      })

      createAnexo(null, respostaCriada.id_resposta, anexo)
   

  } catch (error) {
      // Log de erro para depuração
      console.error("Erro ao criar resposta: ", error);

  }
}


// Função para extrair o código do ticket do assunto do e-mail
const extrairCodigoTicket = (assunto) => {
    const regex = /(\d{11})/;  // Expressão regular para extrair o código do ticket
    const match = assunto.match(regex);
    return match ? match[1] : null;  // Retorna o código se encontrado, caso contrário retorna null
};



//Função para extreir nome e email do remente
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
        const { remetente, assunto, mensagem, anexos } = emailData;
        const { nome, email } = parseRemetente(remetente);

        let codigo_ticket;
        do {
            codigo_ticket = gerarCodigoTicket();
           
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
        if(anexos) {
            createAnexo(ticketCriado.id_ticket, null , anexos)
        }
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

const createAnexo = async (idTicket, idResposta, dadosAnexo) => {
    try {
      // Mapeia os anexos e cria as promessas para inserção no banco
      const anexosPromises = dadosAnexo.map((anexo) => {
        return Anexo.create({
          nome: anexo.nome,
          tipo: anexo.tipo,
          arquivo: anexo.arquivo,
          ticket_id: idTicket || null,
          resposta_id: idResposta || null
        });
      });
  
      // Aguarda todas as promessas de criação de anexo
      const anexosCriados = await Promise.all(anexosPromises);
  
      console.log('Anexos criados com sucesso:', anexosCriados);
      return anexosCriados;
    } catch (error) {
      console.error('Erro ao criar anexos:', error);
      throw new Error('Erro ao criar anexos');
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
            subject: `Chamado Criado - ${codigoTicket}`,
            html: `
                <div style="font-family: Verdana, sans-serif; font-size: 18px; text-align: center; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; 
                                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); background-color: #f9f9f9;">
                        <p style="font-weight: bold; font-size: 22px;">Agradecemos por entrar em contato!</p>
                        
                        <p style="font-size: 20px;">Seu chamado foi registrado com sucesso e recebeu o código:</p>
                        <p style="font-size: 24px; font-weight: bold; background-color: #007bff; color: white; padding: 10px; 
                                  display: inline-block; border-radius: 5px;">
                            ${codigoTicket}
                        </p>
        
                        <p style="font-size: 18px; text-align: left; margin-top: 20px;">
                            Para acompanhar o andamento ou enviar novas informações, basta responder a este e-mail.
                        </p>
        
                        <p style="font-size: 18px; text-align: left;">Estamos à disposição para ajudar!</p>
        
                        <p style="font-size: 18px; text-align: left;"><strong>Equipe T.I Fatec Bragança Paulista</strong></p>
        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        
                        <img src="cid:logo" alt="Fatec Bragança Paulista" style="max-width: 100%; height: auto; border-radius: 5px;">
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'logo.png', // Nome do arquivo
                    path: '../backend/public/images/logo.png', // Caminho local do arquivo
                    cid: 'logo' // Identificador usado no `src="cid:logo"`
                }
            ]
        });
        
        //console.log(`Resposta automática enviada para: ${remetente}`);
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
