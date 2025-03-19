const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-ssl.com.br', // Servidor SMTP
  port: 465, // Porta SMTP com SSL/TLS
  secure: true, // Usa SSL/TLS
  auth: {
    user: , // E-mail do usuário
    pass: , // Senha fornecida
  },
});

module.exports = transporter;
