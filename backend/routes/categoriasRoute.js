const express = require('express');
const router = express.Router();

const controller = require('../controllers/categoriaController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');



router.post('/createCategory', controller.createCategoria)
router.put('/editCategory', controller.updateCategoria)
router.delete('/deleteCategory', controller.deleteCategoria)
router.get('/',notLoggedMiddlewares, controller.getAllCategoria)
router.get('/:id',notLoggedMiddlewares, controller.getIdCategoria)

module.exports = router