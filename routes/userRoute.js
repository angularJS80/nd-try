let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let Hellow = require('../models/hellow');




router.post('/register', function(req, res){

    console.log(req.body);


    let user = new User({
        userId: req.body.userId,
        userPw: req.body.userPw,
        contry: req.body.contry
    });
    user.save(function(err, data){
        if(err){
            return res.json({error: true});
        }
        res.json({error:false});
    })
});


router.post('/authenticate', function(req, res){
    let rtnHellow;
    let data = {
        userId: req.body.userId,
        userPw: req.body.userPw
    };
    User.findOne(data).lean().exec(
        function(err, user){



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

            Hellow.findOne({hellow_id:user.contry}).lean().exec(
                function(err, hellow){
                    console.log("hellow : "+hellow)
                    if(err){
                        return res.json({error: true});
                    }
                    if(!hellow){
                        return res.status(404).json({'message':'hellow not found!'});
                    }
                    res.json({error:false, token: token,hellow:hellow.hellow});

                })

    })
});


module.exports = router;