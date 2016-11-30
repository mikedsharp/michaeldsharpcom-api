var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
      message: "this is where you will see projects when I add them"
  })
});

module.exports = router;
