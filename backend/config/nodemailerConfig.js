const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-ssl.com.br', // Servidor SMTP
  port: 465, // Porta SMTP com SSL/TLS
  secure: true, // Usa SSL/TLS
  auth: {
    user: 'servicedesk@fatecbpaulista.edu.br', // E-mail do usuário
    pass: 'ks@4fn.FU-+HjgE', // Senha fornecida
  },
});

module.exports = transporter;
