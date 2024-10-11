const express = require('express');
const router = express.Router();

const controller = require('../controllers/usuariosController');



router.post('/createUser', controller.createUser)
router.put('/updateUser/:id', controller.updateUser)

module.exports = router