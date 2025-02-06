const express = require('express');
const router = express.Router();

const controller = require('../controllers/historicoStatusController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');



router.get('/:id',notLoggedMiddlewares, controller.getHistorico)


module.exports = router