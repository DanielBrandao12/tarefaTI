const express = require('express');
const router = express.Router();

const controller = require('../controllers/relatorioController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');



router.get('/', controller.getViewTickets)


module.exports = router