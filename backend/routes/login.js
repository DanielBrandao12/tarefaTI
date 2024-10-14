const express = require('express');
const router = express.Router();

const controller = require('../controllers/loginControllers');




router.post('/', controller.handleLogin)
router.get('/logout', controller.logout)

module.exports = router