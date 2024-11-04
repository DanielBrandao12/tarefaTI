const express = require('express');
const router = express.Router();
const controller = require('../controllers/relatorioInventarioController')

router.post('/', controller.AddItem)
router.post('/consultaSoft', controller.consultaSoftwares)

module.exports = router;
