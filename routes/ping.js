var express = require('express');
var router = express.Router()
var fs = require('fs');

router.get('/', function(req, res, next) {
  return res.json({message: "you just pinged the dyno-saur!"});
});


module.exports = router;
