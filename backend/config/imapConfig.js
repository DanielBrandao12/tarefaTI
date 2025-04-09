require('dotenv').config();
module.exports = {
    imapConfig: {
      imap: {
<<<<<<< HEAD
      //  user: '', // E-mail do usuário
       // password: '', // Senha fornecida
        host: 'email-ssl.com.br', // Servidor de entrada
=======
        user: process.env.EMAIL_USER, // E-mail do usuário
        password: process.env.EMAIL_PASSWORD, // Senha fornecida
        host: process.env.EMAIL_HOST, // Servidor de entrada
>>>>>>> versao2.1
        port: 993, // Porta IMAP com SSL/TLS
        tls: true, // Habilita TLS
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 60000, // Tempo limite para autenticação
      },
    },
  };
  