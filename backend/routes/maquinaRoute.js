const express = require('express');
const router = express.Router();
const controller = require('../controllers/maquinaController')

router.get('/', controller.consultaMaquina)


module.exports = router;
