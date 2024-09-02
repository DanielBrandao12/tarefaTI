var express = require('express');
const loggedMiddlewares = require('../middlewares/notLoggedMiddlewares');
var router = express.Router();

/* GET users listing. */
router.get('/',  function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
