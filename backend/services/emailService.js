const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const { imapConfig } = require('../config/imapConfig');
const transporter = require('../config/nodemailerConfig');
const { Tickets, Historico_status, Respostas, Anexo } = require('../database/models');
const cheerio = require('cheerio');
require('dotenv').config();

const conectarIMAP = async () => {
    try {
        console.log('Tentando conectar ao IMAP...');
        const connection = await Imap.connect(imapConfig);
        
        // Tratamento de erros na conexão
        connection.on('error', (err) => {
            console.error('Erro na conexão IMAP:', err);
        });

        connection.on('close', (hadError) => {
            console.error('A conexão foi fechada', hadError ? 'devido a um erro' : 'normalmente');
        });

        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao IMAP:', error);
        console.log('Tentando reconectar em 5 segundos...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return conectarIMAP();
    }
};

const checkEmails = async () => {
    let connection;
    try {
        console.log('Iniciando a conexão IMAP...');
        connection = await conectarIMAP();
        console.log('Conexão estabelecida com sucesso!');

        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
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
                const anexos = parsed.attachments ? parsed.attachments.map(att => ({
                    nome: att.filename,
                    tipo: att.contentType,
                    tamanho: att.size,
                    arquivo: att.content
                })) : [];

           
                const chamado = {
                    remetente: parsed.from?.text || parsed.from || 'Desconhecido',
                    assunto: parsed.subject || 'Sem assunto',
                    mensagem: parsed.html || parsed.text || 'Sem mensagem',
                    anexos: anexos || null
                };

                // Garante que chamado.anexos seja sempre um array
                chamado.anexos = chamado.anexos || [];

                const codigoTicket = extrairCodigoTicket(chamado.assunto);

                if (codigoTicket) {
                    const ticketExistente = await getTicketPorCodigo(codigoTicket);
                    console.log(ticketExistente);
                    if (ticketExistente && ticketExistente.id_status !== 4) {
                        console.log(`O ticket ${codigoTicket} já existe. Não será criado um novo chamado.`);
                        const mensagem = getCorpoEmailLimpo(chamado.mensagem);
                        console.log(chamado.mensagem)
                        await createResposta(ticketExistente.dataValues.id_ticket, mensagem, chamado.anexos);
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
            await connection.end();
            console.log('Conexão IMAP encerrada com sucesso!');
        }
    }
};



const getCorpoEmailLimpo = (mensagem) => {
    const $ = cheerio.load(mensagem);
  
    // Remove blocos HTML de respostas e assinaturas comuns
    const seletoresRemocao = [
      'blockquote',
      'div.gmail_quote',
      '.gmail_attr',
      '#divRplyFwdMsg',
      '.BodyFragment',
      'div#ymail_android_signature',
      'a#ymail_android_signature_link',
      'div.yahoo_quoted',
      'div.moz-cite-prefix',
      'div.h5',
      'hr',
      '.signature',
      '.OutlookMessageHeader',
      '.WordSection1',
      '.ms-outlook-mobile-body-separator-line',
      '.ms-outlook-mobile-signature'
    ];
    $(seletoresRemocao.join(',')).remove();
  
    // Remove partes com estilo oculto
    $('[style*="display:none"], [style*="visibility:hidden"]').remove();
  
    // Remove spans vazios
    $('span').each((_, el) => {
      const texto = $(el).text().trim();
      if (!texto || texto === '\u200C') $(el).remove();
    });
  
    // Captura texto do corpo
    const textoCompleto = $('body').text();
  
    // Limpa e quebra por linha
    const linhas = textoCompleto
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);
  
    // Lista de padrões que indicam início de e-mail anterior
    const regexCortes = [
      /^Em\s.+escreveu:/i,
      /^On\s.+wrote:/i,
      /^From:\s.+/i,
      /^De:\s.+/i,
      /^Sent:\s.+/i,
      /^To:\s.+/i,
      /^Subject:\s.+/i,
      /^-----Mensagem original-----/i,
      /^----- Original Message -----/i
    ];
  
    // Acha a primeira linha válida antes de qualquer assinatura ou resposta anterior
    for (const linha of linhas) {
      if (regexCortes.some(rx => rx.test(linha))) break;
      if (/obrigado|agradecemos|estamos à disposição|android|enviado do/i.test(linha)) continue;
      return linha; // <- só a primeira linha considerada "resposta"
    }
  
    return ''; // Caso não encontre nada válido
  };
  
  

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
        if (Array.isArray(anexos) && anexos.length > 0) {

              console.log(ticketCriado.codigo_ticket)
            await createAnexo(ticketCriado.codigo_ticket, null, anexos);
          

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
        if (!idTicket && !idResposta) {
            console.warn('Nenhum ID válido fornecido para anexar arquivos.');
            return;
        }

        if (!Array.isArray(dadosAnexo) || dadosAnexo.length === 0) {
            console.warn('Nenhum anexo válido para salvar.');
            return;
        }

        const anexosPromises = dadosAnexo.map((anexo) => {
            return Anexo.create({
                nome: anexo.nome,
                tipo: anexo.tipo,
                arquivo: anexo.arquivo,
                ticket_id: idTicket || null,
                resposta_id: idResposta || null
            });
        });

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

            from: process.env.EMAIL_USER,
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
