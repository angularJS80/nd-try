let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let User = require('../models/user');

router.post('/register', function(req, res){
    console.log(req.body);
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function(err, data){
        if(err){
            return res.json({error: true});
        }
        res.json({error:false});
    })
});

router.post('/authenticate', function(req, res){
    let data = {
        username: req.body.username,
        password: req.body.password
    };
    User.findOne(data).lean().exec(function(err, user){
        if(err){
            return res.json({error: true});
        }
        if(!user){
            return res.status(404).json({'message':'User not found!'});
        }
        console.log(user);
        let token = jwt.sign(user, global.config.jwt_secret, {
            expiresIn: 1440 // expires in 1 hour
        });
        res.json({error:false, token: token});
    })
});


module.exports = router;