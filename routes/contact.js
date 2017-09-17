var express = require('express');
var router = express.Router()
var nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
    
    let smtpConfig = {
        host: 'smtp.live.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };
    
    var smtpTransport = nodemailer.createTransport(smtpConfig, {from: process.env.EMAIL});

    var mailOptions = {
        "to": process.env.EMAIL,
        "subject": "A user query from michaeldsharp.com",
        "text": "recipient email: " + req.body.from + 
                "\nrecipient name: " + req.body.name +
                "\nMessage: " + req.body.body
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
