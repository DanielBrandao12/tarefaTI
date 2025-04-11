require('dotenv').config();
module.exports = {
    imapConfig: {
      imap: {

        user: process.env.EMAIL_USER, // E-mail do usuário
        password: process.env.EMAIL_PASSWORD, // Senha fornecida
        host: process.env.EMAIL_HOST, // Servidor de entrada
        port: 993, // Porta IMAP com SSL/TLS
        tls: true, // Habilita TLS
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 60000, // Tempo limite para autenticação
      },
    },
  };
  