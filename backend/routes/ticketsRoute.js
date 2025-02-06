const express = require('express');
const router = express.Router();

const controller = require('../controllers/ticketsController');

const emailService = require('../services/emailService');


// Rota para verificar e-mails
router.get('/verificar-emails', async (req, res) => {
  try {
    await emailService.checkEmails();
    res.status(200).send('E-mails verificados com sucesso.');
  } catch (error) {
    console.error('Erro ao verificar e-mails:', error);
    res.status(500).send('Erro ao verificar e-mails.');
  }
});

router.post('/createTicket', controller.createTickets)
router.put('/updateTicket', controller.updateTicket)
router.get('/', controller.getTickets)
router.get('/:id',controller.getTicketsId)
router.get('/listaTarefa/:id', controller.getListaTarefaTicket)

module.exports = router