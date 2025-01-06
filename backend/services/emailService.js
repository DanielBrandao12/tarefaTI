const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const { imapConfig } = require('../config/imapConfig');
const transporter = require('../config/nodemailerConfig');
const chamadoService = require('../controllers/ticketsController');

async function checkEmails() {
  try {
    console.log('Iniciando a conexão IMAP...');
   console.log(chamadoService)
    
    const connection = await Imap.connect(imapConfig);
    
    console.log('Conexão estabelecida com sucesso!');
    
    await connection.openBox('INBOX');
    
    const searchCriteria = ['UNSEEN']; // Buscar apenas e-mails não lidos
    const fetchOptions = { bodies: [''] };

    // Buscar os e-mails não lidos
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Encontrados ${messages.length} e-mails não lidos.`);

    if (messages.length === 0) {
      console.log('Nenhum e-mail novo para processar.');
      return; // Caso não haja e-mails, sai da função
    }

    for (const message of messages) {
      const all = message.parts.find(part => part.which === ''); // Obter o corpo do e-mail
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

      try {
        // Criar ticket a partir do e-mail
        await chamadoService.criarChamadoPorEmail(chamado);
        console.log(`Chamado criado com sucesso para: ${chamado.remetente}`);
      } catch (ticketError) {
        console.error(`Erro ao criar chamado para o e-mail de ${chamado.remetente}:`, ticketError);
        continue; // Ignorar e passar para o próximo e-mail
      }

      try {
        // Enviar resposta automática
        await transporter.sendMail({
          from: 'servicedesk@fatecbpaulista.edu.br',
          to: chamado.remetente,
          subject: 'Chamado Recebido',
          text: 'Obrigado por entrar em contato. Seu chamado foi registrado.',
        });
        console.log(`Resposta automática enviada para: ${chamado.remetente}`);
      } catch (mailError) {
        console.error(`Erro ao enviar resposta automática para ${chamado.remetente}:`, mailError);
      }
    }

    await connection.end();
    console.log('Conexão IMAP encerrada com sucesso!');
  } catch (error) {
    console.error('Erro ao verificar e-mails:', error);
  }
}

module.exports = { checkEmails };
