const express = require('express');
const router = express.Router();
const controller = require('../controllers/relatorioInventarioController')

router.post('/', controller.AddItem)
router.get('/consultaSoft', controller.consultaSoftwares)

module.exports = router;
