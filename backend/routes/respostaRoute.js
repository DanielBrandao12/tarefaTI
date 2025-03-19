const express = require('express');
const router = express.Router();

const controller = require('../controllers/respostasControllers');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');




router.post('/createResposta', controller.createResposta)
router.get('/getRespostas',notLoggedMiddlewares, controller.getResposta)
router.put('/updateResposta', controller.marcarComoLida )
router.get('/getNaoLidas', controller.getRespostasNaoLidas)

module.exports = router