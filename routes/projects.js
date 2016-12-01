var express = require('express');
var router = express.Router()
var fs = require('fs');

router.get('/', function(req, res, next) {
  var json = JSON.parse(fs.readFileSync(__dirname + '/projects.json', 'utf8')); 
  return res.json(json);
});

router.get('/:projectId', function(req, res, next) {
  var json = JSON.parse(fs.readFileSync(__dirname + '/projects.json', 'utf8')); 
  
  if(json.data[req.params.projectId]){
    return res.json({
      "data": json.data[req.params.projectId]
    });
  } else {
    return res.json({}); 
  }
});

module.exports = router;
