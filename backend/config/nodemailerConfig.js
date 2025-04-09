require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Servidor SMTP
  port: 465, // Porta SMTP com SSL/TLS
  secure: true, // Usa SSL/TLS
  auth: {
<<<<<<< HEAD
   // user: '', // E-mail do usuário
   // pass: '', // Senha fornecida
=======
    user: process.env.EMAIL_USER, // E-mail do usuário
    pass: process.env.EMAIL_PASSWORD, // Senha fornecida
>>>>>>> versao2.1
  },
});

module.exports = transporter;
