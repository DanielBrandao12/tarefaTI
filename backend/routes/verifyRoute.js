const express = require('express');
const router = express.Router();

const controller = require('../controllers/loginControllers');


router.get("/check", controller.verify);

module.exports = router