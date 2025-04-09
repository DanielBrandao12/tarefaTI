const express = require('express');
const router = express.Router();

const controller = require('../controllers/ticketsController');

const emailService = require('../services/emailService');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');


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

router.post('/createTicket',notLoggedMiddlewares, controller.createTickets)
router.put('/updateTicket',notLoggedMiddlewares, controller.updateTicket)
router.get('/',notLoggedMiddlewares, controller.getTickets)
router.get('/:id',notLoggedMiddlewares, controller.getTicketsId)
router.get('/listaTarefa/:id', controller.getListaTarefaTicket)
router.delete('/delete/:id',notLoggedMiddlewares, controller.deleteTicket)

module.exports = router