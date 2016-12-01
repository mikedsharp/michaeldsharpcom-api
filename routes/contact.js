var express = require('express');
var router = express.Router()
var nodemailer = require('nodemailer');
var mailConfig = require('../mailConfig'); 

router.post('/', function(req, res, next) {
    var smtpTransport = nodemailer.createTransport("SMTP",{
    service: 'Hotmail',
    auth: {
        "user":  mailConfig.email,
        "pass":  mailConfig.password
    }
    });

    var mailOptions = {
        "from": req.body.name +  " <" + req.body.from + ">", 
        "to":  mailConfig.email, 
        "subject": "A user query from michaeldsharp.com",
        "text": req.body.body
    };

    smtpTransport.sendMail(mailOptions, function(err, data){
        if(err){
            return console.log(err);
        }
        console.log('Message sent: ');
        res.json({"message": "message sent!"}); 
    }); 
});

module.exports = router;
