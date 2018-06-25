var express = require('express');
var Hellow = require('../models/hellow');
var router = express.Router();

//var hellows=[]
//hellows.push({"hellow_id":"japen","hellow":"こんにちは"})
//hellows.push({"hellow_id":"korea","hellow":"안녕하세요."})
//hellows.push({"hellow_id":"usa","hellow":"nice to meet u"})

// GET ALL BOOKS
router.get('/hellows', function(req,res){
    var hellow =  new Hellow();
    hellow.find(function(err, hellows){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(hellows);
    })
});

router.get('/hellow/:hellow_id', function(req, res){
    console.log(req.params);

    Hellow.find({hellow_id:req.params.hellow_id}, function(err, hellow){
        console.log("db result :"+ hellow);
        if(err) return res.status(500).json({error: err});
        if(!hellow) return res.status(404).json({error: 'book not found'});
        res.json(hellow);
    })
});


router.post('/hellow/save', function(req, res){
    console.log(req.body)
    var hellow =  new Hellow();

    console.log(hellow);

    hellow.hellow = req.body.hellow;
    hellow.hellow_id = req.body.hellow_id;

    hellow.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    });

});




/*

router.post('/hellow/add', function(req,res){
    console.log(req.body)
    var hellow = req.body
    hellows.push(hellow);
    res.json(req.body);
});*/

module.exports = router;