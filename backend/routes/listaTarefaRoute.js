const express = require('express');
const router = express.Router();

const controller = require('../controllers/listaTarefaController');



router.post('/addItemLista', controller.addItem)
router.put('/concluirTarefa', controller.alterarStatus)
router.delete('/removerItem', controller.removerItem)

module.exports = router