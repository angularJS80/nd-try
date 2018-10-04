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
    console.log("#################################refreshToken :");
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
            expiresIn: global.config.tokenLife // expires in 1 hour
        });

        let refreshToken = jwt.sign(user, global.config.refreshTokenSecret, {
            expiresIn: global.config.refreshTokenLife
        });
        global.config.allTokens[token]={refreshToken:refreshToken,user:user};


        res.json({error:false, token: token,refreshToken: refreshToken});
    })
});

router.post('/refreshToken', function(req, res){

    var token = req.body.token || req.query.token || req.headers['authorization'];
    let user = global.config.allTokens[token].user;

    token = global.config.allTokens[token].refreshToken
    console.log(user);
    let refreshToken = jwt.sign(user, global.config.jwt_secret, {
        expiresIn: global.config.refreshTokenLife // expires in 1 hour
    });

    global.config.allTokens[token]={refreshToken:refreshToken,user:user};


    res.json({error:false, token: token,refreshToken: refreshToken});
});




module.exports = router;