var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Hellow = require('../models/hellow');


/* toDo : User List
* 사용자 목록 mongoDb agreegate 이용하여 참조문서 정보 표현 할 것
* */



router.post('/userList',function (req,res) {

    User.aggregate([
        {
            "$project" : {

                "user" : "$$ROOT"
            }
        },
        {
            "$lookup" : {
                "localField" : "user.userContry",
                "from" : "hellows",
                "foreignField" : "hellow_id",
                "as" : "hellow"
            }
        },
        {
            "$unwind" : {
                "path" : "$hellow",
                "preserveNullAndEmptyArrays" : true
            }
        }
    ], function (err, result) {
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(result);
    });



})

router.post('/register', function(req, res){

    console.log(req.body);


    var user = new User({
        userId: req.body.userId,
        userPw: req.body.userPw,
        userContry : req.body.country

    });
    console.log(user)



    user.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }

        res.json({result: 1});

    });


});


router.post('/authenticate', function(req, res){
    var rtnHellow;
    var data = {
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

            var token = jwt.sign(user, global.config.jwt_secret, {
                expiresIn: 1440 // expires in 1 hour
            });

            console.log("##################################################"+user.userContry);

            Hellow.findOne({hellow_id:user.userContry}).lean().exec(
                function(err, hellow){


                    if(err){
                        return res.json({error: true});
                    }
                    if(!hellow){
                        return res.status(404).json({'message':'hellow not found!'});
                    }
                    res.json({error:false, token: token,hellow:hellow.hellow});

                })




            console.log(user);



    })
});


module.exports = router;