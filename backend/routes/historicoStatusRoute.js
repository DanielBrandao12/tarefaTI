const express = require('express');
const router = express.Router();

const controller = require('../controllers/historicoStatusController');



router.get('/:id', controller.getHistorico)


module.exports = router