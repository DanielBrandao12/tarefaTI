const express = require('express');
const {getAnexoId} = require('../controllers/anexoController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');
const router = express.Router();

// Definindo a rota para obter anexos por ticket_id ou resposta_id
router.get('/:id', getAnexoId);

module.exports = router;