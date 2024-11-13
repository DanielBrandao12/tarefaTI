const express = require('express');
const router = express.Router();

const controller = require('../controllers/respostasControllers');




router.post('/createResposta', controller.createResposta)
router.get('/getRespostas', controller.getResposta)

module.exports = router