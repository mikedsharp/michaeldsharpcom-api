var express = require('express');
var router = express.Router();

/* POST likes/dislikes. */
router.post('/', function(req, res, next) {
  if(req.body.like === 'true'){
      console.log('like registered');
  } else {
      console.log('dislike registered');
  }
  res.send('like (or dislike recorded!)');
});

module.exports = router;
