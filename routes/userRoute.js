/**
 * Created by jcompia on 2018-01-30.
 */
var express = require('express');
var router = express.Router();
var User = require('./../model/user.js');
var jwt = require('jsonwebtoken');
var jwt_secret = 'secret';
router.get('/', function(req, res, next){
    res.send('respond with a resource');
});
router.post('/authenticate', function(req, res){
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
        if(err) {
            res.json({
                type: false,
                data: 'Error occured' + err
            });
        } else {
            if (user) {
                res.json({
                    type: true,
                    data: user,
                    token: user.token,
                });
            } else {
                res.json({
                    type: false,
                    data: 'Incorrect email/password'
                })
            }
        }
    });
});

router.get('/me', ensureAuthorized, function(req, res){
    User.findOne({token: req.token}, function(err, user){
        if(err) {
            res.json({
                type: false,
                data: 'Error occured: ' + err,
            });
        } else {
            console.log('me: ' + user);
            res.json({
                type: true,
                data: suer,
            });
        }
    });
});
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}
module.exports = router;