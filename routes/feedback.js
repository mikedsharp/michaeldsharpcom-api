var express = require('express');
var router = express.Router();
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

/* POST likes/dislikes. */
router.post('/', function(req, res, next) {
  if(req.body.like === 'true'){
      console.log('like registered');
  } else {
      console.log('dislike registered');
  }
  res.json({message: 'like (or dislike recorded!)'});

  var doc = new GoogleSpreadsheet('1kS7juEJ9G4uxKSplOf5HnWsWC3f6F66moVzKMeTFqxI');
  var sheet;

  async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds_json = {
      client_email: process.env.GOOGLE_DRIVE_EMAIL,
      private_key:  process.env.GOOGLE_PRIVATE_KEY
    }
    doc.useServiceAccountAuth(creds_json, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  },
  function workingWithCells(step) {
    sheet.getCells({
      'min-row': 2,
      'max-row': 4,
      'return-empty': true
    }, function(err, cells) {

      var cellLike = cells[1];
      var lastLike = cells[2]; 
      var cellDislike = cells[27];
      var lastDislike = cells[28]; 

      if(req.body.like === 'true'){
        cellLike.value = parseInt(cellLike.value) + 1; 
        lastLike.value = new Date(Date.now()).toString(); 
      } else {
        cellDislike.value = parseInt(cellDislike.value) + 1; 
        lastDislike.value = new Date(Date.now()).toString(); 
      }
      sheet.bulkUpdateCells(cells, step); //async
    });
  }
]);

});

module.exports = router;
