const express = require('express');
const router = express.Router();

const controller = require('../controllers/statusController');
const { route } = require('./ticketsRoute');



router.post('/createStatus', controller.createStatus)
router.put('/updateStatus', controller.updateStatus)
router.get('/', controller.getStatus)
router.get('/:id', controller.getStatusId)
router.delete('/deleteStatus', controller.deleteStatus)


module.exports = router