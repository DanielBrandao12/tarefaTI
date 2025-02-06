const express = require('express');
const router = express.Router();

const controller = require('../controllers/respostasControllers');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');




router.post('/createResposta', controller.createResposta)
router.get('/getRespostas',notLoggedMiddlewares, controller.getResposta)

module.exports = router