const express = require('express');
const router = express.Router();

const controller = require('../controllers/ticketsController');



router.post('/createTicket', controller.createTickets)
router.put('/updateTicket', controller.updateTicket)
router.get('/', controller.getTickets)
router.get('/:id',controller.getTicketsId)
router.get('/listaTarefa/:id', controller.getListaTarefaTicket)

module.exports = router