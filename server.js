
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
var Bear = require('./app/models/bear'); 
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config'); 
var User = require('./app/models/user'); 

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

mongoose.connect(config.database); // connect to our database
app.set('superSecret', config.secret);

app.use(morgan('dev'));

var router = express.Router(); 

// UNAUTHENTICATED ROUTES 
router.route('/authenticate')
    .post(function(req, res){
        User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err; 

            if(!user){
                res.json({success: false, message: 'Authentication failed. User not found'})
            } else if (user){
                if(user.password != req.body.password){
                        res.json({success: false, message: 'Authentication failed. Wrong password.'}); 
                } else {
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn : '1440m'
                    }); 

                    res.json({
                        success: true, 
                        message: "here's you're token dude, now get out of here!", 
                        token: token
                    }); 
                }
            }
        }); 
    }); 

router.get('/', function(req, res){
    res.send('Hello! The API is at http://localhost:' + port + '/api.' + ' You will need to /authenticate to get to the other routes');
}); 


//AUTHENTICATE ROUTES 
router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token']; 

    if(token){
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if(err){
                return res.json({success: false, message: 'Failed to authenticate token.'}); 
            } else {
                req.decoded = decoded; 
                next(); 
            }
        });
    } else {
        return res.status(403).send({
            success: false, 
            message: 'no token provided.'
        }); 
    }

});




// BEAR ROUTES 
router.route('/users')
    .get(function(req,res){
    User.find({}, function(err, users){
        res.json(users); 
    }); 
}); 

router.route('/bears')
    .post(function(req,res){
        var bear = new Bear(); 
        bear.name = req.body.name; 

        bear.save(function(err){
            if(err){
                res.send(err); 
            }

            res.json({message: 'Bear Created!'}); 
        });
    })
    .get(function(req, res){
        Bear.find(function(err, bears){
            if(err){
                res.send(err); 
            }

            res.json(bears); 
        }); 
    });

router.route('/bears/:bear_id')
    .get(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if(err){
                res.send(err); 
            }

            res.json(bear); 
        })
    })
    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if(err){
                res.send(err);
            }

            bear.name = req.body.name; 

            bear.save(function(err){
                if(err){
                    res.send(err); 
                }

                res.json({message: 'Bear Updated!'}); 

            }); 
        })
 }) 
    .delete(function(req,res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
            if(err){
                res.send(err); 
            }

            res.json({message: 'Successfully Deleted!'});
        }); 
    });

// register routes
app.use('/api', router); 

app.listen(port); 
console.log('hosting on port: ' + port);

