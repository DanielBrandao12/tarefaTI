const express = require('express');
const router = express.Router();

const controller = require('../controllers/usuariosController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');



router.post('/createUser', controller.createUser)
router.put('/updateUser/:id', controller.updateUser)
router.get('/:id',notLoggedMiddlewares, controller.getUserId)
router.get('/',notLoggedMiddlewares, controller.getUserAll)
module.exports = router