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
 
  var doc = new GoogleSpreadsheet('1kS7juEJ9G4uxKSplOf5HnWsWC3f6F66moVzKMeTFqxI');
  var sheet;

  async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
     var creds_json = {
      client_email: "michaeldsharpcom-metrics@bright-anagram-154711.iam.gserviceaccount.com",
      private_key:  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDwLINhBGUby5t\noccneZJLbOYnl6dNAiYijYH+Ran2bavgtnAyF07oi48mJUai2kON1OleCFq+49lG\nnXEoucD/v2lyJgGJqX4kn980fD7Pd/Q5wM7FcAKqo3AKy5MfQSkQ8Xg/G0KxwnM9\nuH9HCsQFd5ZgBYO9KXhXvIkeEriozwFiNXZueJxeiM1dSgqJa7EqZANe6Iwq6DTD\nOIXLYOhSOihpekhf2s++0+aXol4H0y8HRsU7KJhpNOlAh0C8ZHIXjKLisn69a91E\n4s7dRwadTA6UiBT/LRklgR/9h2I9RdOD80w5uPKGr1K7oiKmcoL6CO7gi5Q9geK4\nwDMmeDNhAgMBAAECggEAGygsi3t7BOC3zDXZbzyKczRUacG8UA6wQ7LmCeSYQ7vL\nUI1+2zQomlJiNaSOPCGTpaWYCpeWH0104zsMa935TIG9mzxykiqVeXdEe/+Qpy+5\nDhoVlYaImCu8a4L6kid0Dwmw6PBbPFYBrtpdrflsYGXK0t9w+1k5fNKHI0jtnV18\nIisTtvausxH6EWVq4K+3DWBEOda+UyzOltnj1NH4pEFF3zPNOTWBT8J9f8+WcPfD\n1awHP7KacSL8ZcPBkzISaN3iy297InUHzcsuhLwHih/QLJ8S9jK2T3CiRD2MYOJo\nacDBXW36TKGyjLXMgtc5XL5EdXLJtOSQ68SqnuBJEQKBgQD3jNuzBF71yCilZ0A2\n8V4YGqVRuYUxlezrlFXSXaSugEsx7Vh6mvyVIfygPeFh4P48EGSMbwRFk1PLXk77\nSXC/MyWvfmrizxR6xPG1ETawV2Agl/BCRj1FN+HPf0QiEtCnjkgoxJxwU9EiWKDz\nYl8L+WN9Zu26NX8ULZTIfTkXnwKBgQDKbzh8SijO+JEd16TK+aCVM5RNH7q/VCIX\noxpDSfteP5Pml1ctP3EF3it75WFNOiQ3LPLAhSKS7WDKvoNMkvKj1IN0bKmiaKYo\n3j0dZ03SxwKAug1N5mQLR6P/Jvt9epG+CBs6CKuqG43ozRbGR7ACjDNucTDaYM8s\nPUzMqLbU/wKBgCi2F6OXQm61XknlcyAWDd109F8+XXNMLsyHdp3EHMM+Ah/R4s03\nE/cKwdswkhJgyC7km0SlNVSj6BH4DpExAMPRC4+TAM0QNVQDc6TNkerqU7rIghDE\nMGtjx1UynufjpEEKGz/pJbkrb6dwX/fm4666cuw6szn+dknBPUjDn1INAoGAPmRP\nLYeR0lCsMV1wbhrIEpRGJgscfLHKnCxqAMlBj0fbJtwIQ2rlQ+C42EPXXH0KAnN5\nEjs2b8B376UORMCZxkLOjUicc/D7HWd5wKFBTDCIJfKx/QuAVDWtZwu1wXPQjZhk\nA9v+RLyfXVwwo8Yeinp5s5VxcC0cTU9LZ1yslTMCgYEA6ut9QJ6mNZdFOOKdRQt4\nqQR5jUqa7HIl0RN/+dzFGSrAO2yxrBLedSWsuvRq0diWrz0Pu5G8XgWDq24UjnD2\nVMVADGHRLsiCZ55FiraGhrLw2Zxcw/JHXobqpX5SSvvRB0AVltr+932wPvkGTQiW\nJjfZaC9xNwVag4MTe/VlvGE=\n-----END PRIVATE KEY-----\n"
    };

    try{
        doc.useServiceAccountAuth(creds_json, step);
    } catch(err){
        res.json(err); 
    }
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
