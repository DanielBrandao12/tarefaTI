const express = require('express');
const router = express.Router();

const controller = require('../controllers/tarefasControllers');


router.get('/', controller.getTarefas)
router.post('/create', controller.createTarefa)
router.put('/edit/:id', controller.editTarefa)
router.put('/editC/:id', controller.concluirTarefa)

module.exports = router