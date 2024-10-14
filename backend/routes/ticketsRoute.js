const express = require('express');
const router = express.Router();

const controller = require('../controllers/ticketsController');



router.post('/createTicket', controller.createTickets)


module.exports = router