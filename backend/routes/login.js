const express = require('express');
const router = express.Router();

const controller = require('../controllers/loginControllers');


router.post('/createUser', controller.createUser)
router.post('/',controller.handleLogin)
router.get('/logout', controller.logout)

module.exports = router