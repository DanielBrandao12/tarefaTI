const transporter = require('./config/nodemailerConfig'); // Caminho para o arquivo do transporter

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: 'servicedesk@fatecbpaulista.edu.br', // Seu e-mail
      to: 'drb12da@gmail.com', // E-mail do destinatário
      subject: 'Teste de envio de e-mail', // Assunto do e-mail
      text: 'Olá! Este é um teste de envio de e-mail pelo Node.js.', // Conteúdo do e-mail
    });

    console.log('E-mail enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error.message);
  }
}

sendTestEmail();
