var express = require('express');
var router = express.Router()
var nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    let smtpConfig = {
        host: 'smtp.live.com',
        port: 587,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };
    
    var smtpTransport = nodemailer.createTransport(smtpConfig, {from: 'msharp23@hotmail.co.uk'});

    var mailOptions = {
        "to":  process.env.EMAIL, 
        "subject": "A user query from michaeldsharp.com",
        "text": "from:" + req.body.from + "\nMessage: " + req.body.body
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
