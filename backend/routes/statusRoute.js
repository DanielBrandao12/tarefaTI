const express = require('express');
const router = express.Router();

const controller = require('../controllers/statusController');
const notLoggedMiddlewares = require('../middlewares/notLoggedMiddlewares');



router.post('/createStatus', controller.createStatus)
router.put('/updateStatus', controller.updateStatus)
router.get('/',notLoggedMiddlewares, controller.getStatus)
router.get('/:id', controller.getStatusId)
router.delete('/deleteStatus',notLoggedMiddlewares, controller.deleteStatus)


module.exports = router