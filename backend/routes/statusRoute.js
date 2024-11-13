const express = require('express');
const router = express.Router();

const controller = require('../controllers/statusController');



router.post('/createStatus', controller.createStatus)
router.put('/updateStatus', controller.updateStatus)
router.get('/updateStatus', controller.getStatus)
router.delete('/deleteStatus', controller.deleteStatus)


module.exports = router