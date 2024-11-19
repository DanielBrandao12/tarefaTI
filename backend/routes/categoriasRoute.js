const express = require('express');
const router = express.Router();

const controller = require('../controllers/categoriaController');



router.post('/createCategory', controller.createCategoria)
router.put('/editCategory', controller.updateCategoria)
router.delete('/deleteCategory', controller.deleteCategoria)
router.get('/', controller.getAllCategoria)

module.exports = router